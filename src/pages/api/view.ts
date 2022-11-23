import { createApiHandler } from 'lib/api/handler';
import { VIEW_COOLDOWN } from 'lib/constants';
import Post from 'lib/database/models/post';
import ViewRecord from 'lib/database/models/view-record';
import { connect as db } from '../../lib/database';

const handler = createApiHandler();

handler.post(async (req, res) => {
	const address = req.socket.remoteAddress;
	if (!address) {
		return res.json({
			status: 500,
			message: 'Internal server error.',
		});
	}

	const postId = req.query.post?.toString();
	if (!postId)
		return res.status(400).json({
			status: 400,
			message: 'Missing post query parameter',
		});

	await db();

	const post = await Post.findById(postId);
	if (!post) {
		return res.status(400).json({
			status: 400,
			message: 'Post not found',
		});
	}

	let record = await ViewRecord.findOne({ post: postId, address });

	if (record && Date.now() < record.date.getTime() + VIEW_COOLDOWN) {
		return res.json({
			status: 200,
			message: 'Cooldown in progress',
		});
	}

	record ??= new ViewRecord({
		post: postId,
		address,
	});

	record.date = new Date();
	await record.save();

	post.views++;
	await post.save();

	res.json({
		status: 200,
		message: 'View added',
	});
});

export default handler;
