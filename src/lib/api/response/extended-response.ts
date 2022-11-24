import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

export type HttpData = Record<string, unknown>;

export interface ExtendedResponse extends NextApiResponse {
	statusResponse(status: number, message: string, data?: HttpData): void;
}

export const extendResponse =
	() => (req: NextApiRequest, res: ExtendedResponse, next: NextHandler) => {
		res.statusResponse = function (status, message, data) {
			this.status(status).json({ status, message, data });
		};

		next();
	};
