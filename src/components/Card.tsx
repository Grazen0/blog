import Image from 'next/image';
import { HTMLProps } from 'react';
import classNames from 'classnames';

export interface Props extends HTMLProps<HTMLSpanElement> {
	title: string;
	description: string;
	footer?: string;
	image?: string;
	imageAlt?: string;
}

const Card: React.FC<Props> = ({
	title,
	description,
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
			'overflow-hidden rounded-lg flex flex-col xs:flex-row items-stretch bg-neutral-200 dark:bg-slate-700 my-8 shadow-intense dark:shadow-none'
		)}
	>
		{image && (
			<span className="relative w-auto xs:w-1/3 h-32 xs:h-auto bg-slate-800">
				<Image src={image} alt={imageAlt} layout="fill" className="object-cover text-center" />
			</span>
		)}
		<span className="px-3 py-5">
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
