import { GetStaticProps, NextPage } from 'next/types';
import Link from 'next/link';
import Layout from 'components/layout/Layout';
import Card from 'components/Card';
import PostList from 'components/PostList';
import { getCategory, getPost, listCategories, listPosts } from 'lib/posts';
import { Category, Post } from 'lib/types';

interface Props {
	categories: Category[];
	posts: Post[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const categories = listCategories().map(getCategory);
	const posts = listPosts(null).map(id => getPost(null, id));

	return {
		props: { categories, posts },
	};
};

const Posts: NextPage<Props> = ({ categories, posts }) => (
	<Layout title="All Posts">
		<main className="p-6">
			<h1 className="text-center text-5xl font-bold my-8">All posts</h1>

			<div className="max-w-2xl mx-auto my-16">
				<h2 className="text-2xl font-semibold my-6">Categories:</h2>
				{categories.length > 0 ? (
					<ul>
						{categories.map(category => (
							<li key={category.id}>
								<Link href={`/posts/${category.id}/`}>
									<a>
										<Card
											title={category.name}
											description={category.description}
											image={category.image}
											imageAlt={category.image_alt}
											className="hover:scale-105 transition-all"
										/>
									</a>
								</Link>
							</li>
						))}
					</ul>
				) : (
					<p className="opacity-30 text-xl text-center mt-6 mb-12">No categories available :(</p>
				)}
			</div>

			{posts.length > 0 && (
				<div className="max-w-2xl mx-auto my-16">
					<h2 className="text-2xl font-semibold my-6">Uncategorized posts:</h2>
					<PostList posts={posts} />
				</div>
			)}
		</main>
	</Layout>
);

export default Posts;
