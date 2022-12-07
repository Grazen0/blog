import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useEffect } from 'react';
import axios from 'axios';
import Layout from 'components/layout/Layout';
import NextPostLinks from 'components/layout/NextPostLinks';
import MainImage from 'components/post/MainImage';
import ShareSection from 'components/ShareSection';
import Comments from 'components/Comments';
import { SerializedPost, SerializedCategory } from 'lib/types';
import { getAdjacentPost } from 'lib/posts';
import styles from 'styles/Post.module.css';
import { connect as db } from 'lib/database';
import { POST_REVALIDATION_DELAY } from 'lib/constants';
import Post from 'lib/database/models/post';
import Category from 'lib/database/models/category';
import { formatDate } from 'lib/utils';
import RenderedPostContent from 'components/post/RenderedPostContent';
import BackLink from 'components/layout/BackLink';

interface Props {
	post: SerializedPost;
	previousPost: SerializedPost | null;
	nextPost: SerializedPost | null;
	category: SerializedCategory;
}

export const getStaticPaths: GetStaticPaths = async () => {
	await db();

	const categories = await Category.find();
	const allParams = await Promise.all(
		categories.map(async category => {
			const posts = await Post.find({ category: category._id, draft: false });
			return posts.map(post => ({ category: category.slug, post: post.slug }));
		})
	);

	return {
		paths: allParams.flat().map(params => ({ params })),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const categorySlug = params?.category?.toString();
	const postSlug = params?.post?.toString();
	if (!categorySlug || !postSlug) throw new Error('Category or post slug parameters missing');

	await db();
	const category = await Category.findOne({ slug: categorySlug });
	if (!category) throw new Error('Category not found');

	const post = await Post.findOne({ slug: postSlug, category: category._id, draft: false });
	if (!post || post.draft) throw new Error('Post not found');

	const previousPost = await getAdjacentPost(post.publishedAt, -1, {
		category: category._id,
		draft: false,
	});
	const nextPost = await getAdjacentPost(post.publishedAt, 1, {
		category: category._id,
		draft: false,
	});

	return {
		props: {
			post: post.serializable(),
			previousPost: previousPost?.serializable() || null,
			nextPost: nextPost?.serializable() || null,
			category: category.serializable(),
		},
		revalidate: POST_REVALIDATION_DELAY,
	};
};

const PostPage: NextPage<Props> = ({
	post,
	post: { title, image, imageAlt, views },
	nextPost,
	previousPost,
	category,
}) => {
	useEffect(() => {
		axios.post(`/api/view?post=${encodeURIComponent(post.id)}`).catch(console.error);
	}, [category.id, post.id]);

	return (
		<Layout title={title} description={post.summary} image={image} imageAlt={imageAlt}>
			<main className="p-6">
				<article className={styles.container}>
					<BackLink href={`/posts/${category.slug}`}>{category.name}</BackLink>
					<h1 className="text-center text-4xl sm:text-5xl font-bold mt-12 mb-6 md:px-20 leading-snug">
						{title}
					</h1>
					<div className="text-center my-4">
						📅 <time>{formatDate(new Date(post.publishedAt || 0))}</time> &middot; 👁‍🗨 {views} view
						{views !== 1 && 's'}
					</div>
					{image && <MainImage src={image} alt={imageAlt} width={800} height={420} />}
					<div className="my-12 post-container">
						<RenderedPostContent>{post.content}</RenderedPostContent>
					</div>
				</article>
				{(previousPost || nextPost) && (
					<NextPostLinks category={category} previous={previousPost} next={nextPost} />
				)}
				<ShareSection post={post} category={category} className="max-w-2xl mx-auto text-lg" />
				<Comments className="my-10 max-w-2xl mx-auto" />
			</main>
		</Layout>
	);
};

export default PostPage;
