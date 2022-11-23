import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import BackLink from 'components/layout/BackLink';
import Layout from 'components/layout/Layout';
import { SerializedCategory, SerializedPost } from 'lib/types';
import Post from 'lib/database/models/post';
import { connect as db } from 'lib/database';
import Category from 'lib/database/models/category';
import PostForm, { PostFormState } from 'components/form/PostForm';
import Alert from 'components/Alert';

interface Props {
	post: SerializedPost;
	categories: SerializedCategory[];
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
	if (!params) throw new Error('No URL parameters provided');

	await db();
	const post = await Post.findById(params.post?.toString());
	if (!post?.category._id.equals(params.category?.toString() || '')) return { notFound: true };

	const categories = await Category.find();

	return {
		props: {
			post: post.serializable(),
			categories: categories.map(category => category.serializable()),
		},
	};
};

const EditPostPage: NextPage<Props> = ({ post, categories }) => {
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = async (postData: PostFormState) => {
		try {
			const { data } = await axios.put(`/api/category/${post.category}/posts/${post.id}`, postData);
			router.push(`/admin/categories/${data.category}/posts/${data.id}`);
		} catch (e) {
			const err = e as AxiosError;
			console.error(err);
			setErrorMessage(err.response?.data?.message || err.message);

			throw err;
		}
	};

	return (
		<Layout title={`Edit ${post.title}`}>
			<main className="p-6">
				<BackLink href={`/admin/categories/${post.category}/posts/${post.id}`}>
					Back to post
				</BackLink>
				<h1 className="text-center text-4xl font-semibold my-8">Edit Post</h1>
				<PostForm
					onSubmit={handleSubmit}
					submitLabel="Save"
					initialState={post}
					categoryOptions={categories}
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

export default EditPostPage;
