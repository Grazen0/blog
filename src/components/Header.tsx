import Link from 'next/link';

const links = [
	{ to: '/about', label: 'About' },
	{ to: '/posts', label: 'Posts' },
];

const Header: React.FC = () => (
	<header className="flex py-4 px-4 sm:px-6 bg-neutral-300 items-center">
		<h1 className="text-2xl">
			<Link href="/">Cholo&apos;s Blog</Link>
		</h1>

		<nav>
			<ul className="flex mx-8 items-center">
				{links.map((link, index) => (
					<li key={index} className="mx-4 text-lg">
						<Link href={link.to}>{link.label}</Link>
					</li>
				))}
			</ul>
		</nav>
	</header>
);

export default Header;
