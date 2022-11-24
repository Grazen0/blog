import { createApiHandler } from 'lib/api/handler';
import { HttpBadRequestError, HttpConflictError } from 'lib/api/response/error';
import { connect as db } from 'lib/database';
import Subscription from 'lib/database/models/subscription';
import { sendEmail } from 'lib/email';
import { subscriptionMessage } from 'lib/email/templates';
import { retryPromise, validateEmail } from 'lib/utils';

const handler = createApiHandler();

handler.post(async (req, res) => {
	const { email } = req.body;
	if (!email) throw new HttpBadRequestError('Missing email in request body');
	if (!validateEmail(email)) throw new HttpBadRequestError('Invalid email');

	await db();

	let subscription = await Subscription.findOne({ email });
	if (subscription) throw new HttpConflictError('Email is already subscribed');

	subscription = new Subscription({ email });
	await subscription.save();

	await retryPromise(async () => {
		if (!subscription) throw new Error('Failed to create subscription');
		await sendEmail(subscriptionMessage(subscription.id), email);
	}, 10).catch(console.error);

	res.json(subscription);
});

export default handler;
