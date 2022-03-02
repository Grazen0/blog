import Image, { ImageProps } from 'next/image';
import { HTMLProps } from 'react';
import classNames from 'classnames';

export interface Props extends HTMLProps<HTMLDivElement> {
	src: string;
	alt: string;
	imgProps?: Omit<ImageProps, 'src' | 'alt' | 'layout'>;
}

const MainImage: React.FC<Props> = ({ src, alt, imgProps, className, ...props }) => (
	<figure {...props} className={classNames(className, 'my-12')}>
		<div className="relative max-w-[50rem] h-64 md:h-96 mx-auto my-2 shadow-intense dark:shadow-none">
			<Image
				{...imgProps}
				src={src}
				alt={alt}
				layout="fill"
				priority
				className={classNames(
					'rounded object-cover rounded object-center align-middle',
					imgProps?.className
				)}
			/>
		</div>
		<figcaption className="text-center my-3 text-neutral-700 dark:text-slate-400">{alt}</figcaption>
	</figure>
);

export default MainImage;
