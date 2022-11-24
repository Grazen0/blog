import { createApiHandler } from 'lib/api/handler';
import { HttpBadRequestError, HttpNotFoundError } from 'lib/api/response/error';
import { VIEW_COOLDOWN } from 'lib/constants';
import Post from 'lib/database/models/post';
import ViewRecord from 'lib/database/models/view-record';
import { connect as db } from '../../lib/database';

const handler = createApiHandler();

handler.post(async (req, res) => {
	const address = req.socket.remoteAddress;
	if (!address) throw new Error('');

	const postId = req.query.post?.toString();
	if (!postId) throw new HttpBadRequestError('Missing post ID query parameter');

	await db();

	const post = await Post.findById(postId);
	if (!post) throw new HttpNotFoundError('Post not found');

	let record = await ViewRecord.findOne({ post: postId, address });

	if (record && Date.now() < record.date.getTime() + VIEW_COOLDOWN) {
		return res.statusResponse(200, 'Cooldown in progress');
	}

	record ??= new ViewRecord({
		post: postId,
		address,
	});

	record.date = new Date();
	await record.save();

	post.views++;
	await post.save();

	res.statusResponse(200, 'View added');
});

export default handler;
