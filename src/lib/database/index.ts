import mongoose from 'mongoose';
import PostStats from './models/post-stats';

export async function connect() {
	const url = process.env.DATABASE_URL;
	if (!url) throw new Error('Database URL enviroment variable not found.');

	await mongoose.connect(url);
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
