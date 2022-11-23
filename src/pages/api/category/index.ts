import authenticate from 'lib/api/authenticate';
import { createApiHandler } from 'lib/api/handler';
import triggerDeployment from 'lib/api/trigger-deployment';
import Category from 'lib/database/models/category';

const handler = createApiHandler();

handler.use(authenticate());

// Create a category
handler.post(async (req, res) => {
	const { name, description, slug, image, imageAlt = '' } = req.body;
	if (!name || !description || !slug || !image) {
		return res.status(400).json({
			status: 400,
			message: 'Missing fields in request body',
		});
	}

	if (await Category.exists({ slug })) {
		return res.status(400).json({
			status: 400,
			message: 'Another post with same slug already exists',
		});
	}

	const category = new Category({ name, description, slug, image, imageAlt });
	await category.save();

	await triggerDeployment();

	res.json(category.serializable());
});

export default handler;
