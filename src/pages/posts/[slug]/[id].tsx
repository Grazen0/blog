import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
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
import { Category, Post, Sorted } from 'lib/types';
import { listCategories, listPosts, getSortedPost, getCategory } from 'lib/posts';
import styles from 'styles/Post.module.css';
import { connect as db, getPostStats } from 'lib/database';
import { useEffect } from 'react';
import axios from 'axios';
import { VIEW_COUNT_REFRESH_RATE } from 'lib/constants';

interface Props {
	post: Sorted<Post>;
	category?: Category;
	views: number;
}

export const getStaticPaths: GetStaticPaths = async () => {
	const categories = listCategories();
	const posts = categories
		.map(category => listPosts(category).map(post => ({ category, post })))
		.flat();

	return {
		paths: posts.map(info => ({ params: { slug: info.category, id: info.post } })),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const categoryId = params?.slug?.toString();
	const id = params?.id?.toString();
	if (!categoryId || !id) throw new Error('Category or post ID parameters missing');

	const post = getSortedPost(categoryId, id);
	if (!post) throw new Error('Post not found');

	const category = getCategory(categoryId);

	await db();
	const stats = await getPostStats(id, categoryId);

	return {
		props: {
			post,
			category,
			views: stats.viewCount,
			randomTestNumber: Math.floor(Math.random() * 1000),
		},
		revalidate: VIEW_COUNT_REFRESH_RATE,
	};
};

const Post: NextPage<Props> = ({
	post,
	post: { title, summary, image, image_alt, content, date, nextPost, prevPost },
	category,
	views,
}) => {
	useEffect(() => {
		axios
			.post(
				`/api/view?post=${encodeURIComponent(post.id)}&category=${encodeURIComponent(
					category?.id || ''
				)}`
			)
			.catch(console.error);
	}, [category?.id, post.id]);

	return (
		<Layout title={title} description={summary} image={image} imageAlt={image_alt}>
			<main className="p-6">
				<article className={styles.container}>
					<h1 className="text-center text-5xl font-bold mt-12 mb-6">{title}</h1>
					<div className="text-center my-4">
						📅 <time>{date}</time>{' '}
						{category && (
							<>
								&middot; <AnimatedLink href={`/posts/${category.id}`}>{category.name}</AnimatedLink>{' '}
							</>
						)}
						&middot; 👁‍🗨 {views} view{views !== 1 && 's'}
					</div>
					{image && image_alt && <MainImage src={image} alt={image_alt} width={800} height={420} />}
					<div className="my-12 post-container">
						<ReactMarkdown
							remarkPlugins={[remarkGfm, remarkUnwrapImages]}
							components={{
								a: PostLink,
								code: CodeBlock,
								img: ({ node, ...props }) => <PostImage {...props} />,
								blockquote: BlockQuote,
							}}
						>
							{content}
						</ReactMarkdown>
					</div>
				</article>
				{(prevPost || nextPost) && <NextPostLinks previous={prevPost} next={nextPost} />}
				<ShareSection post={post} className="max-w-2xl mx-auto text-lg" />
				<Comments className="my-10" />
			</main>
		</Layout>
	);
};

export default Post;
