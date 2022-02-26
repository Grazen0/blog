import Link from 'next/link';
import { useState } from 'react';
import classNames from 'classnames';
import AnimatedLink from './AnimatedLink';
import DarkModeSwitch from './DarkModeSwitch';
import GitHubIcon from './icons/GitHubIcon';
import MenuIcon from './icons/MenuIcon';
import { tailwindConfig } from '../lib/constants';

const links = [
	{ to: '/about', label: 'About' },
	{ to: '/posts', label: 'Posts' },
];

const Header: React.FC = () => {
	const [open, setOpen] = useState(false);

	return (
		<header className="relative flex py-3 px-4 sm:px-6 bg-neutral-300 dark:bg-slate-800 items-center">
			<h1 className="text-3xl font-display">
				<Link href="/">Cholo&apos;s Blog</Link>
			</h1>

			<div className="sm:flex flex-grow hidden">
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
			</div>

			<div className="sm:hidden flex flex-grow">
				<button
					onClick={() => setOpen(prev => !prev)}
					className="ml-auto bg-neutral-350 dark:bg-slate-700 rounded outline-neutral-200 dark:outline-slate-400 outline outline-0 transition-all duration-75 focus:outline-[3px]"
					aria-label="Open header menu"
				>
					<MenuIcon width={40} height={40} />
				</button>
				<div
					className={classNames(
						'absolute top-full left-0 w-full bg-neutral-300 dark:bg-slate-800 transition-transform origin-top',
						open ? 'scale-y-100' : 'scale-y-0'
					)}
				>
					<nav>
						<ul>
							{links.map((link, index) => (
								<li
									key={index}
									className="py-2 mx-4 border-b border-neutral-600 dark:border-slate-600"
								>
									<AnimatedLink href={link.to}>{link.label}</AnimatedLink>
								</li>
							))}
						</ul>
					</nav>
					<div className="flex items-center m-4">
						<DarkModeSwitch />
						<Link href="https://github.com/ElCholoGamer/blog">
							<a>
								<GitHubIcon width={30} height={30} className="ml-5 mr-1 inline" /> Source
							</a>
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
