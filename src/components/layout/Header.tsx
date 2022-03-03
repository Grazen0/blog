import Link from 'next/link';
import React, { HTMLProps, useState, useRef } from 'react';
import classNames from 'classnames';
import DarkModeSwitch from '../DarkModeSwitch';
import GitHubIcon from '../icons/GitHubIcon';
import MenuIcon from '../icons/MenuIcon';
import NavBar from './NavBar';
import { LinkInfo } from 'lib/types';
import { useClickOutside } from 'lib/hooks/use-click-outside';

const links: LinkInfo[] = [
	{ to: '/about', label: 'About' },
	{ to: '/posts', label: 'Posts' },
];

const SwitchAndGithub: React.FC<HTMLProps<HTMLDivElement>> = props => (
	<div {...props}>
		<DarkModeSwitch />
		<Link href="https://github.com/ElCholoGamer/blog">
			<a>
				<GitHubIcon width={30} height={30} className="ml-5 mr-1 inline" /> Source
			</a>
		</Link>
	</div>
);

const Header: React.FC = () => {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	useClickOutside(() => setOpen(false), menuRef);

	return (
		<header
			ref={menuRef}
			className="relative flex py-3 px-4 sm:px-6 bg-neutral-300 dark:bg-slate-800 items-center"
		>
			<a className="text-3xl font-display">
				<Link href="/">Cholo&apos;s Blog</Link>
			</a>

			<div className="sm:flex flex-grow hidden">
				<NavBar
					links={links}
					ulClassName="flex mx-8 items-center"
					linkClassName="mx-4 text-lg font-semibold"
				/>
				<SwitchAndGithub className="ml-auto flex items-center" />
			</div>

			<div className="sm:hidden flex flex-grow z-50">
				<button
					onClick={() => setOpen(prev => !prev)}
					className="ml-auto bg-neutral-400 dark:bg-slate-700 rounded outline-neutral-200 dark:outline-slate-400 outline outline-0 transition-all duration-75 focus:outline-[3px]"
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
					<NavBar
						links={links}
						liClassName="py-2 mx-4 border-b border-neutral-600 dark:border-slate-600"
					/>
					<SwitchAndGithub className="flex items-center m-4" />
				</div>
			</div>
		</header>
	);
};

export default Header;
