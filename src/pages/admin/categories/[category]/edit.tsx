import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import Alert from 'components/Alert';
import CategoryForm, { CategoryFormState } from 'components/form/CategoryForm';
import BackLink from 'components/layout/BackLink';
import Layout from 'components/layout/Layout';
import { connect as db } from 'lib/database';
import Category from 'lib/database/models/category';
import { SerializedCategory } from 'lib/types';

interface Props {
	categoryInfo: SerializedCategory;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
	await db();
	const category = await Category.findById(params?.category?.toString());
	if (!category) return { notFound: true };

	return {
		props: {
			categoryInfo: category.serializable(),
		},
	};
};

const EditCategory: NextPage<Props> = ({ categoryInfo }) => {
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = async (formData: CategoryFormState) => {
		try {
			const { data } = await axios.put(`/api/category/${categoryInfo.id}`, formData);
			router.push(`/admin/categories/${data.id}`);
		} catch (e: unknown) {
			const err = e as AxiosError;
			console.error(err);
			setErrorMessage(err.message);
			throw err;
		}
	};

	return (
		<Layout title="Edit category">
			<main className="p-6">
				<BackLink href={`/admin/categories/${categoryInfo.id}`}>{categoryInfo.name}</BackLink>
				<h1 className="text-center text-5xl font-bold my-6">Edit Category</h1>
				<CategoryForm onSubmit={handleSubmit} initialState={categoryInfo} submitLabel="Update" />
				{errorMessage && (
					<div className="text-center">
						<Alert color="red" className="block mx-auto">
							Error: {errorMessage}
						</Alert>
					</div>
				)}
			</main>
		</Layout>
	);
};

export default EditCategory;
