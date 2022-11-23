import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import Button from 'components/Button';
import Card from 'components/Card';
import Layout from 'components/layout/Layout';
import Category from 'lib/database/models/category';
import { SerializedCategory } from 'lib/types';
import BackLink from 'components/layout/BackLink';
import { connect as db } from 'lib/database';

interface Props {
	categories: SerializedCategory[];
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	await db();
	const categories = await Category.find();

	return {
		props: {
			categories: categories.map(category => category.serializable()),
		},
	};
};

const AdminPosts: NextPage<Props> = ({ categories }) => (
	<Layout title="Post Categories">
		<main className="p-6">
			<BackLink href="/admin">Admin panel</BackLink>
			<h1 className="text-4xl font-bold mt-6 mb-12 text-center">Post Categories</h1>
			<div className="text-center">
				<Button href="/admin/categories/new">+ Create new</Button>
			</div>
			<ul className="max-w-3xl mx-auto my-16">
				{categories.map(category => (
					<li key={category.id} className="hover:scale-105 transition-all">
						<Link href={`/admin/categories/${category.id}`}>
							<Card
								title={category.name}
								description={category.description}
								image={category.image}
								imageAlt={category.imageAlt}
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
