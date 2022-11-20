import authenticate from 'lib/api/authenticate';
import { createApiHandler } from 'lib/api/handler';
import { connect as db } from 'lib/database';
import Category from 'lib/database/models/category';

const handler = createApiHandler();

handler.put(authenticate(), async (req, res) => {
	await db();
	const category = await Category.findById(req.query.category?.toString());
	if (!category) {
		return res.status(404).json({
			status: 404,
			message: 'Category not found',
		});
	}

	const { name, description, slug, image, imageAlt } = req.body;
	if (name) category.name = name;
	if (description) category.description = description;
	if (slug) category.slug = slug;
	if (image) category.image = image;
	category.imageAlt = imageAlt;

	await category.save();
	await res.revalidate('/posts');
	await res.revalidate(`/posts/${slug}`);

	return res.json(category.serializable());
});

export default handler;
