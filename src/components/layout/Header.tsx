import Link from 'next/link';
import { Rubik } from '@next/font/google';
import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import DarkModeSwitch from '../DarkModeSwitch';
import GitHubIcon from '../icons/GitHubIcon';
import MenuIcon from '../icons/MenuIcon';
import NavBar from './NavBar';
import { LinkInfo } from 'lib/types';
import { useClickOutside } from 'lib/hooks/click-outside';

const links: LinkInfo[] = [
	{ to: '/posts', label: 'Posts' },
	{ to: '/about', label: 'About' },
];

const rubik = Rubik({ subsets: [] });

const Header: React.FC = () => {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useClickOutside(() => setOpen(false), menuRef);

	return (
		<header
			ref={menuRef}
			className="relative flex py-3 px-4 sm:px-6 bg-neutral-300 dark:bg-slate-800 items-center top-0 z-50"
		>
			<Link href="/" className={classNames('text-3xl font-bold', rubik.className)}>
				Cholo&apos;s Dev Blog
			</Link>

			<div className="flex flex-grow z-50">
				<button
					onClick={() => setOpen(prev => !prev)}
					className="sm:hidden ml-auto bg-neutral-400 dark:bg-slate-700 rounded outline-neutral-200 dark:outline-slate-400 outline outline-0 transition-all duration-75 focus:outline-[3px]"
					aria-label="Open header menu"
				>
					<MenuIcon width={40} height={40} />
				</button>

				<div
					className={classNames(
						'absolute sm:static sm:flex sm:flex-grow top-full left-0 w-full sm:w-auto bg-neutral-300 dark:bg-slate-800 transition-transform origin-top',
						open ? 'scale-y-100' : 'scale-y-0 sm:scale-y-100'
					)}
				>
					<NavBar
						links={links}
						liClassName="py-2 mx-4 border-b border-neutral-600 dark:border-slate-600 sm:border-none sm:py-0 sm:mx-0"
						ulClassName="sm:flex sm:mx-8 sm:items-center md:h-full"
						linkClassName="sm:mx-4 sm:text-lg sm:font-semibold"
					/>

					<div className="flex flex-wrap items-center m-4 sm:m-0 sm:ml-auto">
						<Link
							href="/subscribe"
							className="relative font-semibold dark:text-neutral-900 shadow-md dark:shadow-none mr-8 my-2 md:my-0 rounded-md px-4 py-1.5 transition-all z-50 overflow-hidden duration-150 bg-yellow-300 before:absolute before:w-[105%] before:h-full before:bg-yellow-400 before:top-0 before:left-0 before:z-[-1] before:translate-x-[105%] hover:before:translate-x-0 before:transition-all"
						>
							✉ Subscribe!
						</Link>
						<div className="flex items-center my-2 md:my-1">
							<DarkModeSwitch />
							<Link href="https://github.com/ElCholoGamer/blog">
								<GitHubIcon width={30} height={30} className="ml-5 mr-1 inline" /> Source
							</Link>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
