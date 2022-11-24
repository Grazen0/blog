import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import PostForm, { PostFormState } from 'components/form/PostForm';
import Layout from 'components/layout/Layout';
import { connect as db } from 'lib/database';
import Category from 'lib/database/models/category';
import { SerializedCategory } from 'lib/types';
import { useRouter } from 'next/router';
import BackLink from 'components/layout/BackLink';
import Alert from 'components/Alert';

interface Props {
	category: SerializedCategory;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
	await db();
	const category = await Category.findById(params?.category?.toString());
	if (!category) return { notFound: true };

	return {
		props: {
			category: category.serializable(),
		},
	};
};

const NewPost: NextPage<Props> = ({ category }) => {
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = async (postData: PostFormState) => {
		try {
			const { data } = await axios.post(`/api/category/${category.id}/posts`, postData);
			router.push(`/admin/categories/${data.category}/posts/${data.id}`);
		} catch (e) {
			const err = e as AxiosError;
			console.error(err);
			setErrorMessage(err.response?.data.message || err.message);
			throw err;
		}
	};

	return (
		<Layout title={`New Post on ${category.name}`}>
			<main className="p-6">
				<BackLink href={`/admin/categories/${category.id}/posts`}>
					Posts on {category.name}
				</BackLink>
				<h1 className="text-center font-semibold my-8 text-4xl">New Post</h1>
				<PostForm
					onSubmit={handleSubmit}
					categoryOptions={category}
					submitLabel="Save"
					initialState={{ category: router.query.c?.toString() }}
				/>
				{errorMessage && (
					<div className="text-center">
						<Alert color="red">Error: {errorMessage}</Alert>
					</div>
				)}
			</main>
		</Layout>
	);
};

export default NewPost;
