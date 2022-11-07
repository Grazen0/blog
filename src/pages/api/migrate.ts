import fs from 'node:fs';
import grayMatter from 'gray-matter';
import YAML from 'yaml';
import { createApiHandler } from 'lib/api/handler';
import Category from 'lib/database/models/category';
import { connect as db } from 'lib/database';
import Post from 'lib/database/models/post';
import PostStats from 'lib/database/models/post-stats';
import ViewRecord from 'lib/database/models/view-record';

const handler = createApiHandler();

handler.get(async (req, res) => {
	const categoryDirs = fs.readdirSync('posts');

	const categories = categoryDirs.map(dir => {
		const info = YAML.parse(fs.readFileSync(`posts/${dir}/category.yml`, { encoding: 'utf-8' }));
		info.imageAlt = info.image_alt;
		delete info.image_alt;
		return {
			...info,
			slug: dir,
		};
	});

	await db();
	const postsMap = await Promise.all(
		categories.map(async categoryInfo => {
			let category = await Category.findOne({ slug: categoryInfo.slug });
			if (!category) {
				category = await Category.create(categoryInfo);
			}

			const postFiles = fs
				.readdirSync(`posts/${categoryInfo.slug}`)
				.filter(file => file !== 'category.yml');

			return {
				id: category._id,
				slug: category.slug,
				posts: postFiles,
			};
		})
	);

	for (const { id: categoryId, slug: categorySlug, posts: files } of postsMap) {
		for (const filename of files) {
			const fileContents = fs.readFileSync(`posts/${categorySlug}/${filename}`, {
				encoding: 'utf-8',
			});
			console.log(fileContents.split('\n').slice(0, 7).join('\n'));
			const { content, data: postInfo } = grayMatter(fileContents);

			if (await Post.exists({ slug: postInfo.slug, category: categoryId.toString() })) continue;
			console.log('Migrating post:', postInfo);

			const slug = filename.split('.')[0];
			const post = new Post({
				title: postInfo.title,
				summary: postInfo.summary,
				image: postInfo.image,
				imageAlt: postInfo.image_alt,
				slug: filename.split('.')[0],
				category: categoryId,
				content,
			});

			const stats = await PostStats.findById(`${categorySlug}@${slug}`);
			if (stats) {
				post.views = stats.viewCount;
				stats.views;
				await post.save();

				await ViewRecord.create(
					stats.views.map(view => {
						return {
							address: view.address,
							post: post._id,
							date: new Date(view.date),
						};
					})
				);
			} else {
				await post.save();
			}
		}
	}

	res.json({ posts: postsMap });
});

export default handler;
