import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { NextHandler } from 'next-connect';

const authenticate = () => async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
	const token = await getToken({ req });
	if (!token) {
		return res.status(401).json({
			status: 401,
			message: 'Unauthorized',
		});
	}

	next();
};

export default authenticate;
