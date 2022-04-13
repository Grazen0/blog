import { createApiHandler } from 'lib/api/handler';
import Subscription from 'lib/database/models/subscription';
import { sendEmail } from 'lib/email';
import { notification } from 'lib/email/templates';

const handler = createApiHandler();

handler.post(async (req, res) => {
	if (process.env.ADMIN_KEY && req.headers.authorization !== process.env.ADMIN_KEY) {
		return res.status(40).json({
			status: 400,
			message: 'Unauthorized',
		});
	}

	const subscriptions = await Subscription.find();

	for (const subscription of subscriptions) {
		sendEmail(notification(req.body, subscription.id), subscription.email).catch(console.error);
	}

	res.json({
		status: 200,
		message: 'Notifications dispatched',
	});
});

export default handler;
