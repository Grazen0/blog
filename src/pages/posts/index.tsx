import { GetStaticProps, NextPage } from 'next/types';
import Layout from 'components/Layout';
import { Category, Post } from 'lib/types';
import { getCategory, getPost, listCategories, listPosts } from 'lib/posts';
import Image from 'next/image';
import Link from 'next/link';
import Card from 'components/Card';
import { formatDate, parseDate } from 'lib/date';

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
					<ul>
						{posts.map(post => (
							<li key={post.id}>
								<Link href={`/posts/${post.id}/`}>
									<a>
										<Card
											title={post.title}
											description={post.summary}
											footer={formatDate(new Date(post.date))}
											image={post.image}
											imageAlt={post.image_alt}
											className="hover:scale-105 transition-all"
										/>
									</a>
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
		</main>
	</Layout>
);

export default Posts;
