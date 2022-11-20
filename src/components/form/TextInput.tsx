import { ComponentProps } from 'react';

export interface Props extends Omit<ComponentProps<'input'>, 'type'> {
	type?: 'text' | 'password';
}

const TextInput: React.FC<Props> = ({ type = 'text', ...props }) => (
	<input
		{...props}
		type={type}
		className="rounded-lg text-neutral-900 px-4 py-2 w-full my-4 border border-neutral-600 dark:border-none"
	/>
);

export default TextInput;
