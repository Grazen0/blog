import { createApiHandler } from 'lib/api/handler';
import { connect as db } from 'lib/database';
import Subscription from 'lib/database/models/subscription';

const handler = createApiHandler();

handler.delete(async ({ query }, res) => {
	if (!query.sid) {
		return res.status(400).json({
			status: 400,
			message: 'Missing sid query parameter',
		});
	}

	await db();
	const subscription = await Subscription.findById(query.sid);

	if (!subscription) {
		return res.status(404).json({
			status: 404,
			message: 'Subscription not found',
		});
	}

	await subscription.delete();
	res.json({
		status: 200,
		message: 'Subscription deleted',
	});
});

export default handler;
