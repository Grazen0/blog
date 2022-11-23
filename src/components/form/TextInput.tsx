import classNames from 'classnames';
import { ComponentProps } from 'react';

export interface Props extends Omit<ComponentProps<'input'>, 'type'> {
	type?: 'text' | 'password' | 'email';
}

const TextInput: React.FC<Props> = ({ type = 'text', className, ...props }) => (
	<input
		{...props}
		type={type}
		className={classNames(
			'rounded-lg text-neutral-900 dark:text-white bg-white dark:bg-slate-950 px-4 py-2 w-full my-4 border border-neutral-600 dark:border-none',
			className
		)}
	/>
);

export default TextInput;
