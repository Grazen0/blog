import Link, { LinkProps } from 'next/link';
import classNames from 'classnames';

export interface Props extends LinkProps {
	href: string;
	external?: boolean;
	className?: string;
}

const AnimatedLink: React.FC<Props> = ({
	href,
	external = false,
	className,
	children,
	...props
}) => (
	<Link
		{...props}
		href={href}
		{...(external ? { target: '_blank', rel: 'noopener noreferrer' } : undefined)}
		className={classNames(
			className,
			'hover:text-blue-500 underline-animation transition-all relative after:bg-blue-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:hover:w-full after:transition-all'
		)}
	>
		{children}
	</Link>
);

export default AnimatedLink;
