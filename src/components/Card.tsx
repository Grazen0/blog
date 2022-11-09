import Image from 'next/legacy/image';
import { HTMLProps } from 'react';
import classNames from 'classnames';

export interface Props extends HTMLProps<HTMLSpanElement> {
	title: string;
	description: string;
	head?: string;
	footer?: string;
	image?: string;
	imageAlt?: string;
}

const Card: React.FC<Props> = ({
	title,
	description,
	head,
	footer,
	image,
	imageAlt,
	className,
	...props
}) => (
	<span
		{...props}
		className={classNames(
			className,
			'my-8 overflow-hidden rounded-lg grid grid-rows-[minmax(0,1.25fr)_minmax(0,1fr)] xs:grid-rows-none xs:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] bg-neutral-200 dark:bg-slate-700 shadow-intense dark:shadow-none'
		)}
	>
		{image && (
			<span className="relative bg-slate-800">
				<Image src={image} alt={imageAlt} layout="fill" className="object-cover text-center" />
			</span>
		)}
		<span className="px-6 py-4 flex-grow">
			{head && <p className="text-md mb-2">{head}</p>}
			<h3 className="text-2xl xs:text-3xl mb-3 font-semibold">{title}</h3>
			<p className="xs:text-xl">{description}</p>
			{footer && (
				<p className="mt-1">
					<small>{footer}</small>
				</p>
			)}
		</span>
	</span>
);

export default Card;
