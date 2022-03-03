import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Layout from 'components/Layout';
import PostList from 'components/PostList';
import { getCategory, getPost, isCategory, listCategories, listPosts } from 'lib/posts';
import { Category, Post } from 'lib/types';
import PostPage from './[id]';

export type Props =
	| {
			type: 'post';
			post: Post;
	  }
	| {
			type: 'category';
			category: Category;
			posts: Post[];
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
					posts: listPosts(postOrCategory).map(id => getPost(postOrCategory, id)),
			  }
			: {
					type: 'post',
					post: getPost(null, postOrCategory),
			  },
	};
};

const PostOrCategory: NextPage<Props> = props => {
	if (props.type === 'post') return <PostPage {...props.post} />;

	const { name, description, image, image_alt } = props.category;
	const title = `Category: ${name}`;

	return (
		<Layout title={title} description={description} image={image} imageAlt={image_alt}>
			<main className="p-6">
				<h1 className="text-5xl text-center font-bold mt-10 mb-2">{title}</h1>
				<p className="text-center my-6 text-xl">{description}</p>
				{image && (
					<div className="relative h-72 w-[30rem] max-w-full mx-auto my-10 shadow-intense dark:shadow-none">
						<Image src={image} alt={image_alt} layout="fill" className="rounded object-cover" />
					</div>
				)}

				<div className="max-w-2xl mx-auto my-16">
					<PostList posts={props.posts} />
				</div>
			</main>
		</Layout>
	);
};

export default PostOrCategory;
