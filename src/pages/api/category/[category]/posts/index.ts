import authenticate from 'lib/api/authenticate';
import { createApiHandler } from 'lib/api/handler';
import Post from 'lib/database/models/post';
import { HttpBadRequestError } from 'lib/api/response/error';
import { attachCategory, RequestWithCategory } from '..';

const handler = createApiHandler<RequestWithCategory>();

handler.use(authenticate(), attachCategory());

// Create a post
handler.post(async (req, res) => {
	const { title, summary, image, imageAlt, slug, content } = req.body;
	if (!title || !summary || !image || !imageAlt || !slug || !content) {
		throw new HttpBadRequestError('Missing fields in request body');
	}

	if (await Post.exists({ slug, category: req.category._id }))
		throw new HttpBadRequestError('Post with the same slug already exists');

	const post = new Post({
		title,
		summary,
		slug,
		image,
		imageAlt,
		content,
		category: req.category._id,
	});
	await post.save();

	res.json(post.serializable());
});

export default handler;
