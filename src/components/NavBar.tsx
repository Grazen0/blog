import { HTMLProps } from 'react';
import { LinkInfo } from '../lib/types';
import AnimatedLink from './AnimatedLink';

export interface Props extends HTMLProps<HTMLDivElement> {
	links: LinkInfo[];
	liClassName?: string;
	ulClassName?: string;
	linkClassName?: string;
}

const NavBar: React.FC<Props> = ({ links, liClassName, ulClassName, linkClassName, ...props }) => (
	<nav {...props}>
		<ul className={ulClassName}>
			{links.map((link, index) => (
				<li key={index} className={liClassName}>
					<AnimatedLink href={link.to} className={linkClassName}>
						{link.label}
					</AnimatedLink>
				</li>
			))}
		</ul>
	</nav>
);

export default NavBar;
