import { createApiHandler } from 'lib/api/handler';
import { VIEW_COOLDOWN } from 'lib/constants';
import PostStats from 'lib/database/models/post-stats';
import { doesPostExist } from 'lib/posts';
import { connect as db, getPostStats } from '../../lib/database';

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
		return res.json({
			status: 400,
			message: 'Missing post query parameter',
		});

	const categoryId = req.query.category?.toString();

	if (!doesPostExist(postId, categoryId)) {
		return res.json({
			status: 404,
			message: 'Post does not exist',
		});
	}

	await db();

	const stats = await getPostStats(postId, categoryId);

	const entry = stats.views.find(e => e.address === address);
	if (entry && Date.now() < entry.date + VIEW_COOLDOWN) {
		return res.json({
			status: 204,
			message: 'Cooldown in progress',
		});
	}

	if (!entry) {
		stats.views.push({ address, date: Date.now() });
	} else {
		entry.date = Date.now();
	}

	stats.viewCount++;
	await stats.save();

	res.json({
		status: 200,
		message: 'View added',
	});
});

export default handler;
