import Image, { ImageProps } from 'next/image';
import { HTMLProps } from 'react';
import classNames from 'classnames';

export interface Props extends HTMLProps<HTMLDivElement> {
	src: string;
	alt: string;
	width: number;
	height: number;
	imgProps?: Omit<ImageProps, 'src' | 'alt' | 'layout'>;
}

const MainImage: React.FC<Props> = ({ src, alt, width, height, imgProps, className, ...props }) => (
	<figure {...props} className={classNames(className, 'my-12')}>
		<div className="text-center my-2">
			<Image
				{...imgProps}
				src={src}
				alt={alt}
				width={width}
				height={height}
				priority
				className={classNames(
					'object-cover object-center align-middle text-center rounded bg-neutral-300 dark:bg-slate-950',
					imgProps?.className
				)}
			/>
		</div>
		<figcaption className="text-center my-3 text-neutral-700 dark:text-slate-400">{alt}</figcaption>
	</figure>
);

export default MainImage;
