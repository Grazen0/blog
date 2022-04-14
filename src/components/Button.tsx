import classNames from 'classnames';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

export interface Props
	extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	color?: keyof typeof classes;
	border?: boolean;
}

const classes = {
	blue: {
		base: 'outline-cyan-300',
		normal: 'bg-cyan-600',
		border: 'text-cyan-600 hover:bg-cyan-600 shadow-[0_0_0_2px_theme(colors.cyan.600)_inset]',
	},
	red: {
		base: 'outline-red-300',
		normal: 'bg-red-500',
		border: 'text-red-500 hover:bg-red-500 shadow-[0_0_0_2px_theme(colors.red.500)_inset]',
	},
	yellow: {
		base: 'outline-yellow-200',
		normal: 'bg-yellow-500',
		border: 'text-yellow-500 hover:bg-yellow-500 shadow-[0_0_0_2px_theme(colors.yellow.500)_inset]',
	},
	green: {
		base: 'outline-green-300',
		normal: 'bg-green-500',
		border: 'text-green-500 hover:bg-green-500 shadow-[0_0_0_2px_theme(colors.green.500)_inset]',
	},
};

const Button: React.FC<Props> = ({ color = 'blue', border, className, children, ...props }) => (
	<button
		{...props}
		className={classNames(
			className,
			'rounded-md py-2 px-4 font-semibold outline outline-0 focus:outline-[3px] transition-all duration-100 disabled:brightness-75 disabled:outline-0 disabled:cursor-not-allowed',
			classes[color].base,
			!border && classes[color].normal,
			border && `${classes[color].border} hover:text-white`
		)}
	>
		{children}
	</button>
);

export default Button;
