import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import Button from 'components/Button';
import Layout from 'components/layout/Layout';
import Category from 'lib/database/models/category';
import { SerializedCategory, SerializedPost } from 'lib/types';
import BackLink from 'components/layout/BackLink';
import Post from 'lib/database/models/post';
import { connect as db } from 'lib/database';
import axios, { AxiosError } from 'axios';
import Alert from 'components/Alert';
import AnimatedLink from 'components/AnimatedLink';
import { useRouter } from 'next/router';

interface Props {
	categoryInfo: SerializedCategory;
	postCount: number;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
	await db();
	const category = await Category.findById(params?.category?.toString());
	if (!category) return { notFound: true };

	const postCount = await Post.countDocuments({ category: category._id });

	return {
		props: {
			categoryInfo: category.serializable(),
			postCount,
		},
	};
};

const CategoryPanel: NextPage<Props> = ({ categoryInfo, postCount }) => {
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const deletePrompt = () => {
		if (!confirm(`Are you sure you want to delete this category and its ${postCount} posts?`))
			return;

		axios
			.delete(`/api/category/${categoryInfo.id}`)
			.then(() => router.push('/admin/categories'))
			.catch((err: AxiosError) => {
				console.error(err);
				setErrorMessage(err.message);
			});
	};

	return (
		<Layout title={categoryInfo.name}>
			<main className="p-6">
				<BackLink href="/admin/categories">Categories</BackLink>
				<h1 className="text-4xl font-semibold mt-12 mb-4 text-center">{categoryInfo.name}</h1>
				<p className="text-center mb-8 text-xl">
					{postCount} post{postCount !== 1 && 's'} &middot;{' '}
					<AnimatedLink href={`/posts/${categoryInfo.slug}`} className="font-semibold">
						View
					</AnimatedLink>
				</p>
				<figure className="text-center block my-12">
					<Image
						src={categoryInfo.image}
						alt={categoryInfo.imageAlt}
						width={800}
						height={420}
						priority
						className=" rounded-lg inline"
					/>
					<figcaption className="my-3 text-neutral-600 dark:text-slate-400">
						{categoryInfo.imageAlt}
					</figcaption>
				</figure>
				<div className="text-center mb-16">
					<Button className="text-xl mx-2" href={`/admin/categories/${categoryInfo.id}/posts`}>
						View posts
					</Button>
					<Button className="text-xl mx-2" href={`/admin/categories/${categoryInfo.id}/edit`}>
						Edit category
					</Button>
					<Button className="text-xl mx-2" color="red" border onClick={deletePrompt}>
						Delete category
					</Button>
					<br />
					<Button
						color="green"
						className="text-xl mt-12 inline-block"
						href={`/admin/categories/${categoryInfo.id}/posts/new`}
					>
						+ Create post
					</Button>
				</div>
				{errorMessage && (
					<div className="text-center">
						<Alert color="red">Error: {errorMessage}</Alert>
					</div>
				)}
			</main>
		</Layout>
	);
};

export default CategoryPanel;
