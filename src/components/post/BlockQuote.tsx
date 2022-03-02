import classNames from 'classnames';
import { HTMLProps } from 'react';
import { ReactMarkdownProps } from 'react-markdown/lib/ast-to-react';

export type Props = HTMLProps<HTMLElement> & ReactMarkdownProps;

const BlockQuote: React.FC<Props> = ({ node, className, children, ...props }) => (
	<blockquote
		className={classNames(
			className,
			'bg-neutral-300 dark:bg-slate-700 border-neutral-400 dark:border-slate-400 border-l-4 px-4 py-2 max-w-2xl mx-auto rounded'
		)}
		{...props}
	>
		{children}
	</blockquote>
);

export default BlockQuote;
