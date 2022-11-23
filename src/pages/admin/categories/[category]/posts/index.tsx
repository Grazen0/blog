import { GetServerSideProps, NextPage } from 'next';
import { SerializedPost, SerializedCategory } from 'lib/types';
import Category from 'lib/database/models/category';
import Post from 'lib/database/models/post';
import Layout from 'components/layout/Layout';
import Card from 'components/Card';
import Link from 'next/link';
import BackLink from 'components/layout/BackLink';
import { connect as db } from 'lib/database';
import Button from 'components/Button';

interface Props {
	posts: SerializedPost[];
	category: SerializedCategory;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
	if (!params) throw new Error('No URl parameters available');

	await db();
	const category = await Category.findById(params.category?.toString());
	if (!category) return { notFound: true };

	const posts = await Post.find({ category: category._id });

	return {
		props: {
			category: category.serializable(),
			posts: posts.map(post => post.serializable()),
		},
	};
};

const AdminPosts: NextPage<Props> = ({ posts, category }) => (
	<Layout title={`Posts on ${category.name}`}>
		<main className="p-6">
			<BackLink href={`/admin/categories/${category.id}`}>{category.name}</BackLink>
			<div className="text-center">
				<h1 className="text-4xl font-semibold mt-10 mb-8">Posts on Category</h1>
				<Button
					color="green"
					className=" inline-block"
					href={`/admin/categories/${category.id}/posts/new`}
				>
					+ Create
				</Button>
			</div>
			<ul className="max-w-3xl mx-auto my-16">
				{posts.map(post => (
					<li key={post.id} className="hover:scale-105 transition-all">
						<Link href={`/admin/categories/${category.id}/posts/${post.id}`}>
							<Card
								head={post.draft ? 'Draft' : ''}
								title={post.title}
								description={post.summary || '(No summary available)'}
								image={post.image}
								imageAlt={post.imageAlt}
								className="my-4"
							/>
						</Link>
					</li>
				))}
			</ul>
		</main>
	</Layout>
);

export default AdminPosts;
