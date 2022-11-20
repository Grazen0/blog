import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import Button from 'components/Button';
import TextInput from 'components/form/TextInput';
import Layout from 'components/layout/Layout';
import Category from 'lib/database/models/category';
import { SerializedCategory } from 'lib/types';
import BackLink from 'components/layout/BackLink';
import Post from 'lib/database/models/post';
import useDelayedState from 'lib/hooks/delayed-state';
import { connect as db } from 'lib/database';
import axios, { AxiosError } from 'axios';
import Alert from 'components/Alert';

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
	const [submitDisabled, setSubmitDisabled] = useState(true);
	const [displayName, setDisplayName] = useState(categoryInfo.name);
	const [displayImage, setDisplayImage] = useState({
		src: categoryInfo.image,
		alt: categoryInfo.imageAlt,
	});
	const [formState, setFormState] = useState({
		name: categoryInfo.name,
		description: categoryInfo.description,
		slug: categoryInfo.slug,
		image: categoryInfo.image,
		imageAlt: categoryInfo.imageAlt,
	});
	const imagePreviewSrc = useDelayedState(formState.image);

	const handleChange =
		(
			field: keyof typeof formState,
			transform?: (value: string) => string
		): ChangeEventHandler<HTMLInputElement> =>
		e => {
			setSubmitDisabled(false);
			setFormState(state => ({
				...state,
				[field]: transform?.(e.target.value) || e.target.value,
			}));
		};

	const handleSubmit: FormEventHandler = e => {
		e.preventDefault();

		setSubmitDisabled(true);
		axios
			.put(`/api/category/${categoryInfo.id}`, formState)
			.then(({ data }) => {
				setDisplayName(data.name);
				setDisplayImage({
					src: data.image,
					alt: data.imageAlt,
				});
				setStatus({ type: 'success', message: 'Category updated successfully!' });
			})
			.catch((err: AxiosError) => {
				console.error(err);
				setStatus({ type: 'error', message: `Error: ${err.message}` });
				setSubmitDisabled(false);
			});
	};

	return (
		<Layout title={`${categoryInfo.name}`}>
			<main className="p-6">
				<BackLink href="/admin/categories">Categories</BackLink>
				<h1 className="text-4xl font-bold mt-12 mb-4 text-center">{displayName}</h1>
				<p className="text-center mb-8 text-xl">
					{postCount} post{postCount !== 1 && 's'}
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
				<form onSubmit={handleSubmit} className="max-w-2xl mx-auto my-16">
					<label htmlFor="name">Name</label>
					<TextInput
						id="name"
						placeholder="Category name..."
						value={formState.name}
						required
						onChange={handleChange('name', s => s.trimStart())}
					/>
					<label htmlFor="description">Description</label>
					<TextInput
						id="description"
						placeholder="Category description..."
						value={formState.description}
						required
						onChange={handleChange('description', s => s.trimStart())}
					/>
					<label htmlFor="slug">Slug</label>
					<TextInput
						id="slug"
						placeholder="URL slug..."
						value={formState.slug}
						required
						onChange={handleChange('slug', s => s.trimStart().toLowerCase().replaceAll(' ', '-'))}
					/>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
						<div>
							<label htmlFor="image-src">Image source</label>
							<TextInput
								id="image-src"
								required
								value={formState.image}
								onChange={handleChange('image', s => s.trim())}
								placeholder="Image URL..."
							/>
							<label htmlFor="image-alt">Alt text</label>
							<TextInput
								id="image-alt"
								value={formState.imageAlt}
								onChange={handleChange('imageAlt', s => s.trimStart())}
								placeholder="Image alt text..."
							/>
						</div>
						<div className="w-full h-48 xs:h-64 sm:h-full relative">
							<Image
								src={imagePreviewSrc}
								alt={formState.imageAlt}
								fill
								className="object-cover rounded-md bg-neutral-300 dark:bg-slate-800 flex justify-center items-center"
							/>
						</div>
					</div>

					<Button type="submit" className="ml-auto my-12 block" disabled={submitDisabled}>
						Update
					</Button>
					{status && (
						<div className="text-center">
							<Alert color={status.type === 'success' ? 'green' : 'red'} className="block mx-auto">
								{status.message}
							</Alert>
						</div>
					)}
				</form>
			</main>
		</Layout>
	);
};

export default CategoryPanel;
