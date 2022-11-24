import { ChangeEventHandler, FormEventHandler, HTMLProps, useState } from 'react';
import classNames from 'classnames';
import ImageInput from './ImageInput';
import TextInput from './TextInput';
import Button from 'components/Button';
import styles from 'styles/Post.module.css';
import RenderedPostContent from 'components/post/RenderedPostContent';

export interface PostFormState {
	title: string;
	summary: string;
	category: string;
	slug: string;
	image: string;
	imageAlt: string;
	content: string;
}

export interface Props extends Omit<HTMLProps<HTMLFormElement>, 'onSubmit'> {
	onSubmit: (data: PostFormState) => Promise<void>;
	initialState?: Partial<PostFormState>;
	submitLabel: string;
	categoryOptions: { id: string; name: string }[] | { id: string };
}

const PostForm: React.FC<Props> = ({
	onSubmit,
	initialState = {},
	submitLabel,
	categoryOptions,
	className,
	...props
}) => {
	const [previewMode, setPreviewMode] = useState(false);
	const [submitDisabled, setSubmitDisabled] = useState(true);
	const [formState, setFormState] = useState<PostFormState>({
		title: initialState.title || '',
		summary: initialState.summary || '',
		category: Array.isArray(categoryOptions)
			? initialState.category || categoryOptions[0].id
			: categoryOptions.id,
		image: initialState.image || '',
		imageAlt: initialState.imageAlt || '',
		slug: initialState.slug || '',
		content: initialState.content || '',
	});

	const handleSubmit: FormEventHandler = e => {
		e.preventDefault();
		setSubmitDisabled(true);
		onSubmit(formState).catch(() => setSubmitDisabled(false));
	};

	const handleChange =
		(
			field: keyof typeof formState,
			transform?: (value: string) => string
		): ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> =>
		e => {
			setSubmitDisabled(false);
			setFormState(state => ({
				...state,
				[field]: transform?.(e.target.value) || e.target.value,
			}));
		};

	return (
		<form
			{...props}
			onSubmit={handleSubmit}
			className={classNames(className, 'max-w-2xl mx-auto my-16')}
		>
			<label htmlFor="name" className="font-semibold">
				Title
			</label>
			<TextInput
				id="title"
				placeholder="Post title..."
				value={formState.title}
				required
				onChange={handleChange('title', s => s.trimStart())}
			/>
			<label htmlFor="summary" className="font-semibold">
				Summary
			</label>
			<TextInput
				id="summary"
				placeholder="A summary of what the post is about..."
				value={formState.summary}
				required
				onChange={handleChange('summary', s => s.trimStart())}
			/>
			<label htmlFor="slug" className="font-semibold">
				Slug
			</label>
			<TextInput
				id="slug"
				placeholder="URL slug..."
				value={formState.slug}
				required
				onChange={handleChange('slug', s => s.trimStart().toLowerCase().replaceAll(' ', '-'))}
			/>
			{Array.isArray(categoryOptions) && (
				<>
					<label htmlFor="category" className="font-semibold">
						Category
					</label>
					<select
						className="rounded-lg text-neutral-900 dark:text-white bg-white dark:bg-slate-950 px-4 py-2 w-full my-4 border border-neutral-600 dark:border-none"
						value={formState.category}
						onChange={handleChange('category')}
					>
						{categoryOptions.map(category => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</>
			)}
			<ImageInput
				src={formState.image}
				alt={formState.imageAlt}
				onSrcChange={handleChange('image', s => s.trim())}
				onAltChange={handleChange('imageAlt', s => s.trimStart())}
			/>
			<div className="flex justify-between items-center">
				<label htmlFor="content" className="font-semibold">
					Content
				</label>
				<div>
					<Button
						className="rounded-r-none"
						disabled={!previewMode}
						onClick={() => setPreviewMode(false)}
						type="button"
					>
						Edit
					</Button>
					<Button
						className="rounded-l-none"
						disabled={previewMode}
						onClick={() => setPreviewMode(true)}
						type="button"
					>
						Preview
					</Button>
				</div>
			</div>

			<textarea
				id="content"
				value={formState.content}
				onChange={handleChange('content', s => s.trimStart())}
				className={classNames(
					'bg-slate-950 w-full my-4 rounded-lg p-2 font-mono h-[30rem] resize-none',
					previewMode && 'hidden'
				)}
				placeholder="Write your post content here!"
			></textarea>
			<div
				className={classNames(
					'h-[30rem] overflow-auto my-4 bg-slate-950 px-4 text-xl rounded-lg',
					styles.container,
					!previewMode && 'hidden'
				)}
			>
				<RenderedPostContent>{formState.content}</RenderedPostContent>
			</div>
			<Button type="submit" color="green" className="ml-auto my-12 block" disabled={submitDisabled}>
				{submitLabel}
			</Button>
		</form>
	);
};

export default PostForm;
