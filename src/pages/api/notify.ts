import { createApiHandler } from 'lib/api/handler';
import Subscription from 'lib/database/models/subscription';
import { sendEmail } from 'lib/email';
import { notification } from 'lib/email/templates';
import { retry } from 'lib/utils';

const handler = createApiHandler();

handler.post(async (req, res) => {
	if (!process.env.ADMIN_KEY || req.headers.authorization !== process.env.ADMIN_KEY) {
		return res.status(40).json({
			status: 400,
			message: 'Unauthorized',
		});
	}

	const subscriptions = await Subscription.find();

	await Promise.allSettled(
		subscriptions.map(sub => retry(() => sendEmail(notification(req.body, sub.id), sub.email), 10))
	).catch(console.error);

	res.json({
		status: 200,
		message: 'Notifications dispatched',
	});
});

export default handler;
