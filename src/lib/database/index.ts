import mongoose from 'mongoose';
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
