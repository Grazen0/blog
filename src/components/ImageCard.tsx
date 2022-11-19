import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps } from 'react';

export interface Props extends ComponentProps<'span'> {
	link: string;
	head?: string;
	title: string;
	subtitle: string;
	image: string;
	imageAlt?: string;
}

const ImageCard: React.FC<Props> = ({
	className,
	link,
	title,
	head,
	subtitle,
	image,
	imageAlt = '',
	...props
}) => (
	<Link href={link}>
		<span
			{...props}
			className={classNames(
				className,
				'group relative inline-block w-full h-full overflow-hidden rounded-lg shadow-intense dark:shadow-none hover:scale-105 transition-all px-8 py-1 text-neutral-900 dark:text-white after:absolute after:bg-white after:w-full after:h-full after:left-0 after:top-0 after:z-0 after:opacity-30 dark:after:hidden'
			)}
		>
			<Image
				src={image}
				alt={imageAlt}
				fill
				sizes="(max-width: 900px) 100vw, 50vw"
				className="relative object-cover text-center blur-[3px] dark:brightness-[.25] group-hover:blur-[1px] -z-20 transition-all after:absolute after:bg-white after:w-full after:h-full after:left-0 after:top-0 after:z-10"
			/>
			<span className="relative px-6 py-4 flex-grow text-center z-10">
				<p className="text-md mb-2 text-shadow-white dark:text-shadow">{head}</p>
				<h3 className="text-2xl xs:text-4xl mb-6 font-semibold text-shadow-white-md dark:text-shadow-md">
					{title}
				</h3>
				<p className="xs:text-xl text-shadow-white dark:text-shadow mx-auto max-w-md">{subtitle}</p>
			</span>
		</span>
	</Link>
);

export default ImageCard;
