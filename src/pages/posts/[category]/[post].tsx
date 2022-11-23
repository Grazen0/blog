import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
import Layout from 'components/layout/Layout';
import NextPostLinks from 'components/layout/NextPostLinks';
import BlockQuote from 'components/post/BlockQuote';
import CodeBlock from 'components/post/CodeBlock';
import MainImage from 'components/post/MainImage';
import PostImage from 'components/post/PostImage';
import PostLink from 'components/post/PostLink';
import AnimatedLink from 'components/AnimatedLink';
import ShareSection from 'components/ShareSection';
import Comments from 'components/Comments';
import { SerializedCategory, SerializedPost } from 'lib/types';
import { getAdjacentPost } from 'lib/posts';
import styles from 'styles/Post.module.css';
import { connect as db } from 'lib/database';
import { POST_REVALIDATION_DELAY } from 'lib/constants';
import Post from 'lib/database/models/post';
import Category from 'lib/database/models/category';
import { formatDate } from 'lib/utils';
import RenderedPostContent from 'components/post/RenderedPostContent';

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
			const posts = await Post.find({ category: category._id });
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

	const post = await Post.findOne({ slug: postSlug, category: category._id });
	if (!post) throw new Error('Post not found');

	const previousPost = await getAdjacentPost(post.createdAt, -1, { category: category._id });
	const nextPost = await getAdjacentPost(post.createdAt, 1, { category: category._id });

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
					<h1 className="text-center text-5xl font-bold mt-12 mb-6">{title}</h1>
					<div className="text-center my-4">
						📅 <time>{formatDate(new Date(post.createdAt))}</time>{' '}
						{category && (
							<>
								&middot; <AnimatedLink href={`/posts/${category.id}`}>{category.name}</AnimatedLink>{' '}
							</>
						)}
						&middot; 👁‍🗨 {views} view{views !== 1 && 's'}
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
				<Comments className="my-10" />
			</main>
		</Layout>
	);
};

export default PostPage;
