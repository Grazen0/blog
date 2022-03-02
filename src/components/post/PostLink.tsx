import { HTMLProps } from 'react';
import { ReactMarkdownProps } from 'react-markdown/lib/ast-to-react';
import AnimatedLink from 'components/AnimatedLink';
import classNames from 'classnames';

export type Props = HTMLProps<HTMLAnchorElement> & ReactMarkdownProps;

const PostLink: React.FC<Props> = ({ node, children, href, className, ...props }) => {
	if (href === undefined) throw new Error('Missing href attribute');

	return (
		<AnimatedLink
			{...props}
			href={href}
			className={classNames('text-blue-700 dark:text-blue-400', className)}
		>
			{children}
		</AnimatedLink>
	);
};

export default PostLink;
