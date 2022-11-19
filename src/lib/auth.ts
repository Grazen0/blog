import axios from 'axios';

export const getCsrfToken = async (): Promise<string | null> => {
	const res = await axios.get('/api/auth/csrf');
	return res.data.token?.toString();
};
