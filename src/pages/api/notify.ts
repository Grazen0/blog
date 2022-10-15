import { createApiHandler } from 'lib/api/handler';
import { connect as db } from 'lib/database';
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

	await db();
	const subscriptions = await Subscription.find();

	await Promise.allSettled(
		subscriptions.map(sub =>
			retryPromise(() => sendEmail(notification(req.body, sub.id), sub.email), 10)
		)
	);

	res.json({
		status: 200,
		message: 'Notifications dispatched',
	});
});

export default handler;
