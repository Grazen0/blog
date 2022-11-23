import { NextPage } from 'next';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import CategoryForm, { CategoryFormState } from 'components/form/CategoryForm';
import BackLink from 'components/layout/BackLink';
import Layout from 'components/layout/Layout';
import { useState } from 'react';
import Alert from 'components/Alert';

const NewCategory: NextPage = () => {
	const router = useRouter();
	const [alert, setAlert] = useState<string | null>(null);

	const handleSubmit = async (formData: CategoryFormState) => {
		try {
			const { data } = await axios.post('/api/category', formData);
			router.push(`/admin/categories/${data.id}`);
		} catch (e: unknown) {
			const err = e as AxiosError;
			console.error(err);
			setAlert(err.message);
			throw err;
		}
	};

	return (
		<Layout title="New category">
			<main className="p-6">
				<BackLink href="/admin/categories">Categories</BackLink>
				<h1 className="font-bold text-center text-5xl my-8">New Category</h1>
				<CategoryForm onSubmit={handleSubmit} submitLabel="Create" />
				{alert && (
					<div className="text-center">
						<Alert color="red">Error: {alert}</Alert>
					</div>
				)}
			</main>
		</Layout>
	);
};

export default NewCategory;
