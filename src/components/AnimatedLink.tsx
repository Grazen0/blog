import Link from 'next/link';
import { HTMLProps } from 'react';
import classNames from 'classnames';

export interface Props extends HTMLProps<HTMLAnchorElement> {
	href: string;
	external?: boolean;
}

const AnimatedLink: React.FC<Props> = ({
	href,
	key,
	external = false,
	className,
	children,
	...props
}) => (
	<Link href={href} key={key}>
		<a
			{...props}
			{...(external
				? { target: '_blank', rel: classNames(props.rel, 'noopener noreferrer') }
				: undefined)}
			className={classNames(
				className,
				'hover:text-blue-500 underline-animation transition-all relative after:bg-blue-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:hover:w-full after:transition-all'
			)}
		>
			{children}
		</a>
	</Link>
);

export default AnimatedLink;
