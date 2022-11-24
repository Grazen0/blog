import { createApiHandler } from 'lib/api/handler';
import { HttpBadRequestError, HttpNotFoundError } from 'lib/api/response/error';
import { connect as db } from 'lib/database';
import Subscription from 'lib/database/models/subscription';

const handler = createApiHandler();

handler.delete(async ({ query }, res) => {
	if (!query.sid) throw new HttpBadRequestError('Missing "sid" query parameter');

	await db();
	const subscription = await Subscription.findById(query.sid);

	if (!subscription) throw new HttpNotFoundError('Subscription not found');

	await subscription.delete();
	res.statusResponse(200, 'Subscription deleted successfully');
});

export default handler;
