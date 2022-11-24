import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { NextHandler } from 'next-connect';
import { HttpUnauthorizedError } from './response/error';

const authenticate = () => async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
	const token = await getToken({ req });
	if (!token) throw new HttpUnauthorizedError();

	next();
};

export default authenticate;
