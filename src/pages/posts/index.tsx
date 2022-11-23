import { GetStaticProps, NextPage } from 'next/types';
import Layout from 'components/layout/Layout';
import Category from 'lib/database/models/category';
import { connect as db } from 'lib/database';
import { SerializedCategory } from 'lib/types';
import ImageCard from 'components/ImageCard';

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
			<h1 className="text-center text-5xl font-bold my-16">Categories</h1>
			<ul className="max-w-2xl mx-auto">
				{categories.map(category => (
					<li key={category.id}>
						<ImageCard
							link={`/posts/${category.slug}/`}
							title={category.name}
							subtitle={category.description}
							image={category.image}
							imageAlt={category.imageAlt}
							className="my-1"
						/>
					</li>
				))}
			</ul>
		</main>
	</Layout>
);

export default Posts;
