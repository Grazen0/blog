import { Document } from 'mongoose';
import Post, { IPopulatedPost, IPost } from './database/models/post';

export const getAdjacentPost = async (
	postDate: Date,
	place: -1 | 1,
	filter: Partial<IPost>
): Promise<(Document & IPost) | null> => {
	const result = await Post.find({
		...filter,
		draft: false,
		publishedAt: { [place === 1 ? '$gt' : '$lt']: postDate },
	})
		.sort({ publishedAt: place })
		.limit(1);

	return result[0] || null;
};

export const getLatestPosts = async (limit: number): Promise<(Document & IPopulatedPost)[]> => {
	return await Post.find({ draft: false })
		.sort({ publishedAt: -1 })
		.limit(limit)
		.populate('category');
};
