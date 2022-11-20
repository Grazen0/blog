import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import Button from 'components/Button';
import Layout from 'components/layout/Layout';
import Category from 'lib/database/models/category';
import { SerializedCategory } from 'lib/types';
import BackLink from 'components/layout/BackLink';
import Post from 'lib/database/models/post';
import { connect as db } from 'lib/database';
import axios, { AxiosError } from 'axios';
import Alert from 'components/Alert';
import AnimatedLink from 'components/AnimatedLink';
import CategoryForm, { CategoryFormState } from 'components/CategoryForm';

interface Props {
	categoryInfo: SerializedCategory;
	postCount: number;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
	await db();
	const category = await Category.findById(params?.category?.toString());
	if (!category) return { notFound: true };

	const postCount = await Post.countDocuments();

	return {
		props: {
			categoryInfo: category.serializable(),
			postCount,
		},
	};
};

const CategoryPanel: NextPage<Props> = ({ categoryInfo, postCount }) => {
	const [status, setStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
	const [displayName, setDisplayName] = useState(categoryInfo.name);
	const [displayImage, setDisplayImage] = useState({
		src: categoryInfo.image,
		alt: categoryInfo.imageAlt,
	});

	const handleSubmit = async (formData: CategoryFormState) => {
		try {
			const { data } = await axios.put(`/api/category/${categoryInfo.id}`, formData);

			setDisplayName(data.name);
			setDisplayImage({
				src: data.image,
				alt: data.imageAlt,
			});
			setStatus({ type: 'success', message: 'Category updated successfully!' });
		} catch (e: unknown) {
			const err = e as AxiosError;
			console.error(err);
			setStatus({ type: 'error', message: `Error: ${err.message}` });
			throw err;
		}
	};

	return (
		<Layout title={`${categoryInfo.name}`}>
			<main className="p-6">
				<BackLink href="/admin/categories">Categories</BackLink>
				<h1 className="text-4xl font-bold mt-12 mb-4 text-center">{displayName}</h1>
				<p className="text-center mb-8 text-xl">
					{postCount} post{postCount !== 1 && 's'} &middot;{' '}
					<AnimatedLink href={`/posts/${categoryInfo.slug}`} className="font-semibold">
						View
					</AnimatedLink>
				</p>
				<figure className="text-center block my-12">
					<Image
						src={displayImage.src}
						alt={displayImage.alt}
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
					<Button className="text-xl" href={`/admin/categories/${categoryInfo.id}/posts`}>
						View posts
					</Button>
				</div>
				<hr />

				<h2 className="text-2xl font-semibold text-center my-12">Edit category</h2>
				<CategoryForm onSubmit={handleSubmit} initialState={categoryInfo} submitLabel="Update" />
				{status && (
					<div className="text-center">
						<Alert color={status.type === 'success' ? 'green' : 'red'} className="block mx-auto">
							{status.message}
						</Alert>
					</div>
				)}
			</main>
		</Layout>
	);
};

export default CategoryPanel;
