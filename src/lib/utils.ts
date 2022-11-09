import { HOST } from './constants';
import { SerializedCategory, SerializedPopulatedPost, SerializedPost } from './types';

export const withHost = (urlOrPath: string) => {
	if (!urlOrPath.startsWith('http')) {
		urlOrPath = HOST + urlOrPath;
	}
	return urlOrPath;
};

export function postUrl(post: SerializedPopulatedPost): string;
export function postUrl(post: SerializedPost, category: SerializedCategory): string;
export function postUrl(
	post: SerializedPopulatedPost | SerializedPost,
	category?: SerializedCategory
) {
	const categorySlug = (category ?? (post.category as SerializedCategory)).slug;
	return `/posts/${categorySlug}/${post.slug}`;
}

export const validateEmail = (email: string) => {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
};

export const retryPromise = async <T>(promise: () => Promise<T>, max: number): Promise<T> => {
	let attempts = 0;

	while (true) {
		try {
			const result = await promise();
			return result;
		} catch (err) {
			if (++attempts > max) throw err;
		}
	}
};

export const randomRange = (min: number, max: number) => min + Math.random() * (max - min);

const MONTHS = [
	'Jan.',
	'Feb.',
	'Mar.',
	'Apr.',
	'May',
	'Jun.',
	'Jul.',
	'Aug.',
	'Sept.',
	'Oct.',
	'Nov.',
	'Dec.',
];

export const formatDate = (date: Date) => {
	const month = MONTHS[date.getMonth()];
	const day = date.getDate();
	const lastDigit = day % 10;
	const daySuffix = lastDigit === 1 ? 'st' : lastDigit === 2 ? 'nd' : lastDigit === 3 ? 'rd' : 'th';

	return `${month} ${day}${daySuffix}, ${date.getFullYear()}`;
};

export const populatePosts = (posts: SerializedPost[], category: SerializedCategory) => {
	return posts.map(post => ({
		...post,
		category,
	}));
};
