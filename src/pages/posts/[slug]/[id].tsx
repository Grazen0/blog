import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
import Layout from 'components/layout/Layout';
import BlockQuote from 'components/post/BlockQuote';
import CodeBlock from 'components/post/CodeBlock';
import MainImage from 'components/post/MainImage';
import PostImage from 'components/post/PostImage';
import PostLink from 'components/post/PostLink';
import AnimatedLink from 'components/AnimatedLink';
import { formatDate } from 'lib/date';
import { Post } from 'lib/types';
import styles from 'styles/Post.module.css';
import { getPost, listCategories, listPosts } from 'lib/posts';

export type Props = Post;

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
	const category = params?.slug?.toString();
	const id = params?.id?.toString();
	if (!category || !id) throw new Error('Category or post ID parameters missing');

	return {
		props: getPost(category, id),
	};
};

const Post: NextPage<Props> = ({ title, summary, image, image_alt, content, date, category }) => (
	<Layout title={title} description={summary} image={image} imageAlt={image_alt}>
		<main className="p-6">
			<AnimatedLink href={category ? `/posts/${category}/` : '/posts'}>&#8592; Back</AnimatedLink>

			<article className={styles.container}>
				<h1 className="text-center text-5xl font-bold mt-8 mb-3">{title}</h1>
				<div className="text-center my-4">
					Posted on <time>{formatDate(new Date(date))}</time>
				</div>

				{image && image_alt && <MainImage src={image} alt={image_alt} />}
				<div className="my-12">
					<ReactMarkdown
						remarkPlugins={[remarkGfm, remarkUnwrapImages]}
						components={{
							a: PostLink,
							code: CodeBlock,
							img: PostImage,
							blockquote: BlockQuote,
						}}
					>
						{content}
					</ReactMarkdown>
				</div>
			</article>
		</main>
	</Layout>
);

export default Post;
