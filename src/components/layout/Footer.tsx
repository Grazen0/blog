import Link from 'next/link';

const Footer: React.FC = () => (
	<footer className="p-4 text-center">
		<small>Copyright &copy; {new Date().getFullYear()} ElCholoGamer. All rights reserved.</small>
		<br />
		<small className="text-slate-700">
			<Link href="/admin">Admin</Link>
		</small>
	</footer>
);

export default Footer;
