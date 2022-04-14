import classNames from 'classnames';
import { HTMLProps } from 'react';

export interface Props extends HTMLProps<HTMLSpanElement> {
	color: keyof typeof classes;
}

const classes = {
	blue: 'text-blue-500 border-blue-400 bg-blue-200',
	green: 'text-green-600 border-green-300 bg-green-200',
	yellow: 'text-yellow-500 border-yellow-400 bg-yellow-200',
	red: 'text-red-500 border-red-400 bg-red-200',
};

const Alert: React.FC<Props> = ({ color, className, children, ...props }) => (
	<span
		{...props}
		className={classNames(
			className,
			'inline-block text-md text-center font-semibold max-w-3xl mx-auto py-4 px-8 rounded-lg border',
			classes[color]
		)}
	>
		{children}
	</span>
);

export default Alert;
