import mongoose, { Document } from 'mongoose';
import PostStats from './models/post-stats';
import './models/post';
import './models/category';

export async function connect() {
	const url = process.env.DATABASE_URL;
	if (!url) throw new Error('Database URL enviroment variable not found.');

	await mongoose.connect(url, { autoIndex: process.env.NODE_ENV === 'development' });
}

export const transformIdField = (doc: any) => {
	doc.id = doc._id;
	delete doc._id;
};

export const getPostStats = async (postId: string, categoryId: string | null) => {
	const docId = categoryId ? `${categoryId}@${postId}` : postId;
	const stats = await PostStats.findById(docId);

	return stats || new PostStats({ _id: docId });
};
