import { GetStaticProps, NextPage } from 'next/types';
import Link from 'next/link';
import Layout from 'components/layout/Layout';
import Card from 'components/Card';
import Category from 'lib/database/models/category';
import { connect as db } from 'lib/database';
import { SerializedCategory } from 'lib/types';

interface Props {
	categories: SerializedCategory[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	await db();
	const categories = await Category.find();

	return {
		props: { categories: categories.map(category => category.serializable()) },
	};
};

const Posts: NextPage<Props> = ({ categories }) => (
	<Layout title="All Posts">
		<main className="p-6">
			<h1 className="text-center text-5xl font-bold my-8">Categories</h1>
			<ul>
				{categories.map(category => (
					<li key={category.id}>
						<Link href={`/posts/${category.slug}/`}>
							<Card
								title={category.name}
								description={category.description}
								image={category.image}
								imageAlt={category.imageAlt}
								className="hover:scale-105 transition-all"
							/>
						</Link>
					</li>
				))}
			</ul>
		</main>
	</Layout>
);

export default Posts;
