import classNames from 'classnames';
import { CodeProps } from 'react-markdown/lib/ast-to-react';
import SyntaxHighlighter from 'react-syntax-highlighter';

export type Props = CodeProps;

const CodeBlock: React.FC<Props> = ({ node, inline, className, children, ...props }) => {
	const content = String(children).trim();

	const match = className
		?.split(' ')
		.map(c => /language-(\w+)/.exec(c))
		.find(Boolean);

	return !inline ? (
		<SyntaxHighlighter
			language={match?.[1] || 'text'}
			useInlineStyles={false}
			PreTag="div"
			className="rounded bg-neutral-200 dark:bg-slate-800 text-[#383a42] dark:text-[#abb2bf] leading-snug px-2 py-1 overflow-x-auto"
			{...props}
		>
			{content}
		</SyntaxHighlighter>
	) : (
		<code
			className={classNames(
				className,
				'text-[#383a42] dark:text-[#abb2bf] bg-neutral-200 dark:bg-slate-800 rounded'
			)}
			{...props}
		>
			{children}
		</code>
	);
};

export default CodeBlock;
