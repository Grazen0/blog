import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import BackLink from 'components/layout/BackLink';
import Layout from 'components/layout/Layout';
import { SerializedPopulatedPost } from 'lib/types';
import Post, { IPopulatedPost } from 'lib/database/models/post';
import Button from 'components/Button';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import Alert from 'components/Alert';
import { useRouter } from 'next/router';
import { connect as db } from 'lib/database';

interface Props {
	post: SerializedPopulatedPost;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
	if (!params) throw new Error('No URL parameters provided');

	await db();
	const post: IPopulatedPost | null = await Post.findById(params.post?.toString()).populate(
		'category'
	);
	if (!post?.category._id.equals(params.category?.toString() || '')) return { notFound: true };

	return {
		props: {
			post: post.serializable(),
		},
	};
};

const AdminPostPage: NextPage<Props> = ({ post: { category, ...post } }) => {
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const previousPage = `/admin/categories/${category.id}/posts`;

	const changePublishedStatus = (published: boolean) => {
		axios
			.patch(`/api/category/${category.id}/posts/${post.id}`, { published })
			.then(() => router.reload())
			.catch((err: AxiosError) => {
				setErrorMessage(err.response?.data.message || err.message);
				console.error(err);
			});
	};

	const deletePrompt = () => {
		if (!confirm('Are you sure you want to delete this post?')) return;

		axios
			.delete(`/api/category/${category.id}/posts/${post.id}`)
			.then(() => router.push(previousPage))
			.catch((err: AxiosError) => {
				setErrorMessage(err.response?.data.message || err.message);
				console.error(err);
			});
	};

	return (
		<Layout title={post.title}>
			<main className="p-6">
				<BackLink href={previousPage}>Posts on {category.name}</BackLink>
				<div className="text-center">
					<h1 className="text-5xl font-semibold text-center mt-12 mb-6">{post.title}</h1>
					<p className="text-center text-xl">
						{post.draft ? (
							<Button color="green" onClick={() => changePublishedStatus(true)}>
								Publish
							</Button>
						) : (
							<>
								<Button className="mx-2" href={`/posts/${category.slug}/${post.slug}`}>
									View
								</Button>
								<Button
									className="mx-2"
									color="yellow"
									onClick={() => changePublishedStatus(false)}
									border
								>
									Unpublish
								</Button>
							</>
						)}
					</p>
					<Image
						src={post.image}
						alt={post.imageAlt}
						width={800}
						height={420}
						priority
						className="rounded-lg inline my-12"
					/>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto mb-16">
					<div className="text-center">
						<h2 className="text-xl my-2">Views</h2>
						<p className="text-6xl">{post.views}</p>
					</div>
					<div className="text-center">
						<h2 className="text-xl my-2">Likes</h2>
						<p className="text-6xl">N/A</p>
					</div>
				</div>
				<div className="text-center mb-16">
					<Button
						className="text-xl mx-2"
						href={`/admin/categories/${category.id}/posts/${post.id}/edit`}
					>
						Edit post
					</Button>
					<Button className="text-xl mx-2" color="red" border onClick={deletePrompt}>
						Delete post
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

export default AdminPostPage;
