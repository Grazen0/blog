import { HOST } from './constants';
import { Post, PartialPost } from './types';

export const completePath = (urlOrPath: string) =>
	urlOrPath.startsWith('http') ? urlOrPath : HOST + urlOrPath;

export const postUrl = (post: PartialPost | Post) =>
	post.category
		? `/posts/${typeof post.category === 'string' ? post.category : post.category.id}/${post.id}`
		: `/posts/${post.id}`;
