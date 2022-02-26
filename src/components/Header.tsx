import Image from 'next/image';
import Link from 'next/link';
import AnimatedLink from './AnimatedLink';
import DarkModeSwitch from './DarkModeSwitch';
import GitHubIcon from './GitHubIcon';

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
		<div className="ml-auto flex items-center">
			<DarkModeSwitch />
			<Link href="https://github.com/ElCholoGamer/blog">
				<a>
					<GitHubIcon width={30} height={30} className="ml-5 mr-1 inline" /> Source
				</a>
			</Link>
		</div>
	</header>
);

export default Header;
