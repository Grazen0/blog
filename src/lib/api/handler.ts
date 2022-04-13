import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

export function createApiHandler<
	Req extends NextApiRequest = NextApiRequest,
	Res extends NextApiResponse = NextApiResponse
>() {
	return nc<Req, Res>({
		onNoMatch: (req, res) => {
			res.status(405).json({
				status: 405,
				message: 'Method not allowed',
			});
		},
		onError: (err, req, res) => {
			console.error(err);

			res.status(500).json({
				status: 500,
				message: 'Internal server error',
			});
		},
	});
}
