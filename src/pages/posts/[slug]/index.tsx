import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Layout from 'components/layout/Layout';
import PostList from 'components/PostList';
import PostPage from './[id]';
import { Category, Post, PartialPost } from 'lib/types';
import {
	getCategory,
	getPartialPost,
	getPost,
	isCategory,
	listCategories,
	listPosts,
	sortbyDateInverse,
} from 'lib/posts';
import { connect as db, getPostStats } from 'lib/database';
import { VIEW_COUNT_REFRESH_RATE } from 'lib/constants';

export type Props =
	| {
			type: 'post';
			post: Post;
			views: number;
	  }
	| {
			type: 'category';
			category: Category;
			posts: PartialPost[];
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

	const isCategoryResult = isCategory(postOrCategory);

	if (!isCategoryResult) await db();

	return {
		props: isCategoryResult
			? {
					type: 'category',
					category: getCategory(postOrCategory),
					posts: listPosts(postOrCategory)
						.map(id => getPartialPost(postOrCategory, id))
						.sort(sortbyDateInverse),
			  }
			: {
					type: 'post',
					post: getPost(null, postOrCategory),
					views: (await getPostStats(postOrCategory, null)).viewCount,
			  },
		revalidate: isCategoryResult ? undefined : VIEW_COUNT_REFRESH_RATE,
	};
};

const PostOrCategory: NextPage<Props> = props => {
	if (props.type === 'post') return <PostPage post={props.post} views={props.views} />;

	const { name, description, image, image_alt } = props.category;

	return (
		<Layout title={name} description={description} image={image} imageAlt={image_alt}>
			<main className="p-6">
				<h1 className="text-5xl text-center font-bold mt-8 mb-2">{name}</h1>
				<p className="text-center my-6 text-xl">{description}</p>
				{image && (
					<div className="relative h-72 w-[30rem] max-w-full mx-auto my-10 shadow-intense dark:shadow-none">
						<Image src={image} alt={image_alt} layout="fill" className="rounded object-cover" />
					</div>
				)}

				<div className="max-w-2xl mx-auto my-16">
					<PostList posts={props.posts} showCategories={false} />
				</div>
			</main>
		</Layout>
	);
};

export default PostOrCategory;
