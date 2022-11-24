import authenticate from 'lib/api/authenticate';
import { createApiHandler } from 'lib/api/handler';
import Post from 'lib/database/models/post';
import { attachCategory, RequestWithCategory } from '..';

const handler = createApiHandler<RequestWithCategory>();

handler.use(authenticate(), attachCategory());

// Create a post
handler.post(async (req, res) => {
	const { title, summary, image, imageAlt, slug, content } = req.body;
	if (!title || !summary || !image || !imageAlt || !slug || !content) {
		return res.status(400).json({
			status: 400,
			message: 'Missing fields in request body',
		});
	}

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
