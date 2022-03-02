/* eslint-disable @next/next/no-img-element */
import classNames from 'classnames';
import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';
import { ReactMarkdownProps } from 'react-markdown/lib/ast-to-react';

export type Props = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> &
	ReactMarkdownProps;

const PostImage: React.FC<Props> = ({ node, alt, className, ...props }) => (
	<figure className="my-16 text-center">
		<img
			{...props}
			alt={alt}
			className={classNames(
				className,
				'my-2 max-h-[28rem] rounded mx-auto shadow-intense dark:shadow-none'
			)}
		/>
		<figcaption className="text-center text-base text-neutral-700 dark:text-slate-400">
			{alt}
		</figcaption>
	</figure>
);

export default PostImage;
