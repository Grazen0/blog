import { createApiHandler } from 'lib/api/handler';
import { connect as db } from 'lib/database';
import Subscription from 'lib/database/models/subscription';
import { sendEmail } from 'lib/email';
import { subscriptionMessage } from 'lib/email/templates';
import { retry, validateEmail } from 'lib/utils';

const handler = createApiHandler();

handler.post(async (req, res) => {
	const { email } = req.body;
	if (!email)
		return res.status(400).json({
			status: 400,
			message: 'Missing email in request body',
		});

	if (!validateEmail(email)) {
		return res.status(400).json({
			status: 400,
			message: 'Email is invalid',
		});
	}

	await db();

	let subscription = await Subscription.findOne({ email });
	if (subscription) {
		return res.status(409).json({
			status: 409,
			message: 'Email is already subscribed',
		});
	}

	subscription = new Subscription({ email });
	await subscription.save();

	retry(() => sendEmail(subscriptionMessage(subscription!.id), email), 20).catch(console.error);
	res.json(subscription);
});

export default handler;
