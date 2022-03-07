import { HTMLProps } from 'react';
import { Post } from 'lib/types';
import classNames from 'classnames';
import AnimatedLink from 'components/AnimatedLink';
import { postUrl } from 'lib/utils';

export interface Props extends HTMLProps<HTMLElement> {
	previous?: Post;
	next?: Post;
}

const NextPostLinks: React.FC<Props> = ({ previous, next, className, ...props }) => (
	<nav
		{...props}
		className={classNames(
			className,
			'max-w-2xl mx-auto text-xl font-semibold mt-24 mb-10 flex flex-wrap'
		)}
	>
		{previous && (
			<AnimatedLink href={postUrl(previous)}>&#8592; Previous: {previous.title}</AnimatedLink>
		)}
		<div className="flex-grow"></div>
		{next && (
			<AnimatedLink href={postUrl(next)} className="text-right">
				Next: {next.title} &#8594;
			</AnimatedLink>
		)}
	</nav>
);

export default NextPostLinks;
