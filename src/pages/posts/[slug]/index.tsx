import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Layout from 'components/Layout';
import { getCategory, getPost, isCategory, listCategories, listPosts } from 'lib/posts';
import { Category, Post as PostOrCategory } from 'lib/types';
import Post from './[id]';

export type Props =
	| {
			type: 'post';
			post: PostOrCategory;
	  }
	| {
			type: 'category';
			category: Category;
	  };

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = listPosts(null);
	const categories = listCategories();

	return {
		paths: [...posts, ...categories].map(slug => ({ params: { slug } })),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps<Props> = async ctx => {
	const postOrCategory = ctx.params?.slug?.toString();
	if (!postOrCategory) throw new Error('Missing slug parameter');

	return {
		props: isCategory(postOrCategory)
			? {
					type: 'category',
					category: getCategory(postOrCategory),
			  }
			: {
					type: 'post',
					post: getPost(null, postOrCategory),
			  },
	};
};

const PostOrCategory: NextPage<Props> = props => {
	if (props.type === 'post') {
		return <Post {...props.post} />;
	}

	const { name, description, image, image_alt } = props.category;

	return (
		<Layout title={name} description={description} image={image} imageAlt={image_alt}>
			<main>
				<h1>Category: {name}</h1>
			</main>
		</Layout>
	);
};

export default PostOrCategory;
