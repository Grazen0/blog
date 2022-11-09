import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/legacy/image';
import Layout from 'components/layout/Layout';
import PostList from 'components/PostList';
import { connect as db } from 'lib/database';
import Category from 'lib/database/models/category';
import Post from 'lib/database/models/post';
import { SerializedCategory, SerializedPost } from 'lib/types';
import { populatePosts } from 'lib/utils';

export interface Props {
	category: SerializedCategory;
	posts: SerializedPost[];
}

export const getStaticPaths: GetStaticPaths = async () => {
	await db();
	const categories = await Category.find();

	return {
		paths: categories.map(category => ({ params: { category: category.slug } })),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps<Props> = async ctx => {
	const categorySlug = ctx.params?.category?.toString();
	if (!categorySlug) throw new Error('Missing slug parameter');

	await db();
	const category = await Category.findOne({ slug: categorySlug });
	if (!category) throw new Error('Category not found');

	const posts = await Post.find({ category: category._id });

	return {
		props: {
			category: category.serializable(),
			posts: posts.map(post => post.serializable()),
		},
	};
};

const CategoryPage: NextPage<Props> = ({
	category,
	category: { name, description, image, imageAlt },
	posts,
}) => {
	const populatedPosts = populatePosts(posts, category);
	return (
		<Layout title={name} description={description} image={image} imageAlt={imageAlt}>
			<main className="p-6">
				<h1 className="text-5xl text-center font-bold mt-8 mb-2">{name}</h1>
				<p className="text-center my-6 text-xl">{description}</p>
				{image && (
					<div className="relative h-72 w-[30rem] max-w-full mx-auto my-10 shadow-intense dark:shadow-none">
						<Image src={image} alt={imageAlt} layout="fill" className="rounded object-cover" />
					</div>
				)}

				<div className="max-w-2xl mx-auto my-16">
					<PostList posts={populatedPosts} showCategories={false} />
				</div>
			</main>
		</Layout>
	);
};

export default CategoryPage;
