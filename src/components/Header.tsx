import Link from 'next/link';
import AnimatedLink from './AnimatedLink';
import DarkModeSwitch from './DarkModeSwitch';

const links = [
	{ to: '/about', label: 'About' },
	{ to: '/posts', label: 'Posts' },
];

const Header: React.FC = () => (
	<header className="flex py-3 px-4 sm:px-6 bg-neutral-300 dark:bg-slate-800 items-center">
		<h1 className="text-3xl font-display">
			<Link href="/">Cholo&apos;s Blog</Link>
		</h1>

		<nav>
			<ul className="flex mx-8 items-center">
				{links.map((link, index) => (
					<li key={index}>
						<AnimatedLink href={link.to} className="mx-4 text-lg font-semibold">
							{link.label}
						</AnimatedLink>
					</li>
				))}
			</ul>
		</nav>
		<DarkModeSwitch className="ml-auto" />
	</header>
);

export default Header;
