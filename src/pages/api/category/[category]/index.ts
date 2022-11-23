import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { Document } from 'mongoose';
import authenticate from 'lib/api/authenticate';
import { createApiHandler } from 'lib/api/handler';
import { connect as db } from 'lib/database';
import Category, { ICategory } from 'lib/database/models/category';
import Post from 'lib/database/models/post';
import triggerDeployment from 'lib/api/trigger-deployment';

export type RequestWithCategory = NextApiRequest & { category: ICategory & Document };

const handler = createApiHandler<RequestWithCategory>();

export const attachCategory =
	() => async (req: RequestWithCategory, res: NextApiResponse, next: NextHandler) => {
		const id = req.query.category?.toString();
		if (!id) throw new Error('Missing category ID route parameter');

		await db();
		const category = await Category.findById(id);
		if (!category) {
			return res.status(404).json({
				status: 404,
				message: 'Category not found',
			});
		}

		req.category = category;
		next();
	};

handler.use(authenticate());
handler.use(attachCategory());

// Update a category
handler.put(async (req, res) => {
	const {
		category,
		body: { name, description, slug, image, imageAlt },
	} = req;
	if (name) category.name = name;
	if (description) category.description = description;
	if (image) category.image = image;
	category.imageAlt = imageAlt;

	if (category.slug != slug) {
		category.slug = slug;
		await category.save();
		await triggerDeployment();
	} else {
		await category.save();
		await res.revalidate('/posts');
		await res.revalidate(`/posts/${slug}`);
	}

	return res.json(category.serializable());
});

// Delete a category
handler.delete(async (req, res) => {
	const { deletedCount } = await Post.deleteMany({ category: req.category._id });
	await req.category.delete();

	await triggerDeployment();

	res.json({
		status: 200,
		message: 'Category deleted successfully',
		deletedCount,
	});
});

export default handler;
