import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
import BlockQuote from './BlockQuote';
import CodeBlock from './CodeBlock';
import PostImage from './PostImage';
import PostLink from './PostLink';

export interface Props {
	children: string;
}

const RenderedPostContent: React.FC<Props> = ({ children }) => (
	<ReactMarkdown
		remarkPlugins={[remarkGfm, remarkUnwrapImages]}
		components={{
			a: PostLink,
			code: CodeBlock,
			img: ({ node, ...props }) => <PostImage {...props} />,
			blockquote: BlockQuote,
		}}
	>
		{children}
	</ReactMarkdown>
);

export default RenderedPostContent;
