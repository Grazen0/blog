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
import { Category, Post, Sorted } from 'lib/types';
import { listCategories, listPosts, getSortedPost, getCategory } from 'lib/posts';
import styles from 'styles/Post.module.css';

interface Props {
	post: Sorted<Post>;
	category?: Category;
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

	return {
		props: { post, category },
	};
};

const Post: NextPage<Props> = ({
	post: { title, summary, image, image_alt, content, date, nextPost, prevPost },
	category,
}) => (
	<Layout title={title} description={summary} image={image} imageAlt={image_alt}>
		<main className="p-6">
			<AnimatedLink href={category ? `/posts/${category.id}/` : '/posts/'}>
				&#8592; Back
			</AnimatedLink>

			<article className={styles.container}>
				{category && <p className="text-2xl text-center font-semibold my-0">{category.name}</p>}
				<h1 className="text-center text-5xl font-bold mt-0 mb-3">{title}</h1>
				<div className="text-center my-4">
					Posted on <time>{date}</time>
				</div>

				{image && image_alt && <MainImage src={image} alt={image_alt} />}
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
		</main>
	</Layout>
);

export default Post;
