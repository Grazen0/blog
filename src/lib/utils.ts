import { HOST } from './constants';
import { Post, PartialPost } from './types';

export const completePath = (urlOrPath: string) =>
	urlOrPath.startsWith('http') ? urlOrPath : HOST + urlOrPath;

export const postUrl = (post: PartialPost | Post) =>
	post.category
		? `/posts/${typeof post.category === 'string' ? post.category : post.category.id}/${post.id}`
		: `/posts/${post.id}`;

export const validateEmail = (email: string) =>
	email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);

export const retry = async <T>(promise: () => Promise<T>, max: number): Promise<T> => {
	let attempts = 0;

	while (true) {
		try {
			const result = await promise();
			return result;
		} catch (err) {
			if (++attempts > max) {
				throw err;
			}
		}
	}
};
