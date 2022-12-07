import { NextApiResponse } from 'next';
import { Document } from 'mongoose';
import { attachCategory, RequestWithCategory } from '..';
import authenticate from 'lib/api/authenticate';
import { createApiHandler } from 'lib/api/handler';
import Post, { IPost } from 'lib/database/models/post';
import { connect as db } from 'lib/database';
import triggerDeployment from 'lib/api/trigger-deployment';
import Subscription from 'lib/database/models/subscription';
import { sendEmail } from 'lib/email';
import { notification } from 'lib/email/templates';
import { SerializedPopulatedPost } from 'lib/types';
import { retryPromise } from 'lib/utils';
import Category from 'lib/database/models/category';
import { HttpBadRequestError, HttpNotFoundError } from 'lib/api/response/error';

type RequestWithPost = RequestWithCategory & { post: IPost & Document };

const handler = createApiHandler<RequestWithPost>();

handler.use(authenticate(), attachCategory());
handler.use(async (req: RequestWithPost, res: NextApiResponse, next) => {
	const id = req.query.post?.toString();
	if (!id) throw new Error('Missing post ID route parameter');

	await db();
	const post = await Post.findOne({ _id: id, category: req.category._id });
	if (!post) throw new HttpNotFoundError('Post not found');

	req.post = post;
	next();
});

// Edit a post
handler.put(async (req, res) => {
	const {
		post,
		body: { title, summary, slug, image, imageAlt, content, category: categoryId },
	} = req;

	if (title) post.title = title;
	if (summary) post.summary = summary;
	if (image) post.image = image;
	if (imageAlt) post.imageAlt = imageAlt;
	if (content) post.content = content;

	let redeploy = false;

	if (post.slug !== slug) {
		redeploy = true;
		post.slug = slug;
	}

	if (categoryId && !post.category.equals(categoryId)) {
		redeploy = true;
		const category = await Category.findById(categoryId);
		if (!category) throw new HttpNotFoundError('Post category not found');

		post.category = category._id;
	}

	post.editedAt = new Date();
	await post.save();

	if (!post.draft) {
		if (redeploy) {
			await triggerDeployment();
		} else {
			await res.revalidate('/');
			await res.revalidate(`/posts/${req.category.slug}`);
			await res.revalidate(`/posts/${req.category.slug}/${post.slug}`);
		}
	}

	res.json(post.serializable());
});

// Publish/unpublish a post
handler.patch(async (req, res) => {
	const { post } = req;
	const { published } = req.body;

	if (published === undefined)
		throw new HttpBadRequestError('Missing "published" field in request body');

	post.draft = !published;
	if (published) post.publishedAt ||= new Date();
	await post.save();

	if (published) {
		const subscriptions = await Subscription.find();
		const postData = post.serializable() as unknown as SerializedPopulatedPost;
		postData.category = req.category.serializable();

		await Promise.allSettled(
			subscriptions.map(sub =>
				retryPromise(() => sendEmail(notification(postData, sub.id), sub.email), 10)
			)
		);
	}

	await triggerDeployment();

	res.json(post.serializable());
});

// Delete a post
handler.delete(async (req, res) => {
	await req.post.delete();
	if (!req.post.draft) await triggerDeployment();

	res.statusResponse(200, 'Post deleted successfully');
});

export default handler;
