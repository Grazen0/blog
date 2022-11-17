import { createApiHandler } from 'lib/api/handler';
import { connect as db } from 'lib/database';
import Post, { IPopulatedPost } from 'lib/database/models/post';
import Subscription from 'lib/database/models/subscription';
import { sendEmail } from 'lib/email';
import { notification } from 'lib/email/templates';
import { retryPromise } from 'lib/utils';

const handler = createApiHandler();

handler.post(async (req, res) => {
	if (!process.env.ADMIN_KEY || req.headers.authorization !== process.env.ADMIN_KEY) {
		return res.status(401).json({
			status: 401,
			message: 'Unauthorized',
		});
	}

	const postId = req.query.post?.toString();
	if (!postId) {
		return res.status(400).json({
			status: 400,
			message: 'Missing "post" query parameter',
		});
	}

	await db();

	const post: IPopulatedPost | null = await Post.findById(postId).populate('category');
	if (!post) {
		return res.status(404).json({
			status: 404,
			message: 'Post not found',
		});
	}

	const subscriptions = await Subscription.find();

	const postData = post.serializable();

	await Promise.allSettled(
		subscriptions.map(sub =>
			retryPromise(() => sendEmail(notification(postData, sub.id), sub.email), 10)
		)
	);

	res.json({
		status: 200,
		message: 'Notifications dispatched',
	});
});

export default handler;
