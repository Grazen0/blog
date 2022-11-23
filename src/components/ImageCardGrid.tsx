import classNames from 'classnames';
import { HTMLProps, Key } from 'react';
import ImageCard from './ImageCard';

export interface Props extends HTMLProps<HTMLUListElement> {
	items: {
		key: Key;
		link: string;
		head?: string;
		title: string;
		subtitle: string;
		image: string;
		imageAlt?: string;
	}[];
}

const ImageCardGrid: React.FC<Props> = ({ items, className, ...props }) => (
	<ul className={classNames(className, 'grid grid-cols-1 md:grid-cols-2 gap-6 p-6')}>
		{items.map(item => (
			<li key={item.key}>
				<ImageCard {...item} />
			</li>
		))}
	</ul>
);

export default ImageCardGrid;
