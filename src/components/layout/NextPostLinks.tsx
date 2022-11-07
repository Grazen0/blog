import { HTMLProps } from 'react';
import classNames from 'classnames';
import AnimatedLink from 'components/AnimatedLink';
import { postUrl } from 'lib/utils';
import { SerializedCategory, SerializedPost } from 'lib/types';

export interface Props extends HTMLProps<HTMLElement> {
	category: SerializedCategory;
	previous: SerializedPost | null;
	next: SerializedPost | null;
}

const NextPostLinks: React.FC<Props> = ({ previous, next, category, className, ...props }) => (
	<nav
		{...props}
		className={classNames(
			className,
			'max-w-2xl mx-auto text-xl font-semibold mt-24 mb-10 flex flex-wrap'
		)}
	>
		{previous && (
			<AnimatedLink href={postUrl(previous, category)}>
				&#8592; Previous: {previous.title}
			</AnimatedLink>
		)}
		<div className="flex-grow"></div>
		{next && (
			<AnimatedLink href={postUrl(next, category)} className="text-right">
				Next: {next.title} &#8594;
			</AnimatedLink>
		)}
	</nav>
);

export default NextPostLinks;
