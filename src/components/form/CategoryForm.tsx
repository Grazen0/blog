import { ChangeEventHandler, FormEventHandler, HTMLProps, useState } from 'react';
import classNames from 'classnames';
import Button from '../Button';
import TextInput from './TextInput';
import ImageInput from './ImageInput';

export interface CategoryFormState {
	name: string;
	description: string;
	slug: string;
	image: string;
	imageAlt: string;
}

export interface Props extends Omit<HTMLProps<HTMLFormElement>, 'onSubmit'> {
	onSubmit: (data: CategoryFormState) => Promise<void>;
	initialState?: CategoryFormState;
	submitLabel: string;
}

const CategoryForm: React.FC<Props> = ({
	className,
	onSubmit,
	initialState,
	submitLabel,
	...props
}) => {
	const [submitDisabled, setSubmitDisabled] = useState(true);
	const [formState, setFormState] = useState<CategoryFormState>({
		name: initialState?.name || '',
		description: initialState?.description || '',
		slug: initialState?.slug || '',
		image: initialState?.image || '',
		imageAlt: initialState?.imageAlt || '',
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
		): ChangeEventHandler<HTMLInputElement> =>
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
			<ImageInput
				src={formState.image}
				alt={formState.imageAlt}
				onSrcChange={handleChange('image', s => s.trim())}
				onAltChange={handleChange('imageAlt', s => s.trimStart())}
			/>
			<Button type="submit" className="ml-auto my-12 block" disabled={submitDisabled}>
				{submitLabel}
			</Button>
		</form>
	);
};

export default CategoryForm;
