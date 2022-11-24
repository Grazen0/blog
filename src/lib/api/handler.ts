import { NextApiRequest } from 'next';
import nc from 'next-connect';
import HttpError from 'lib/api/response/error';
import { ExtendedResponse, extendResponse } from './response/extended-response';

export const createApiHandler = <
	Req extends NextApiRequest = NextApiRequest,
	Res extends ExtendedResponse = ExtendedResponse
>() => {
	const handler = nc<Req, Res>({
		onNoMatch: (req, res) => {
			res.statusResponse(405, 'Method not allowed');
		},
		onError: (err, req, res) => {
			if (err instanceof HttpError) {
				const { status, message, data } = err;
				res.status(status).json({ status, message, data });
			} else {
				console.error('API error:', err.stack);
				res.statusResponse(500, 'Internal server error');
			}
		},
	});

	handler.use(extendResponse());
	return handler;
};
