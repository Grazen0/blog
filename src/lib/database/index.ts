import mongoose from 'mongoose';

export async function connect() {
	const url = process.env.DATABASE_URL;
	if (!url) throw new Error('Database URL enviroment variable not found.');

	await mongoose.connect(url);
}
