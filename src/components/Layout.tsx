import Head from 'next/head';
import { useRouter } from 'next/router';
import { HOST } from '../lib/constants';
import Footer from './Footer';
import Header from './Header';

export interface Props {
	title: string;
	description?: string;
	image?: string;
	imageAlt?: string;
	siteName?: string;
}

const Layout: React.FC<Props> = ({ title, description, image, imageAlt, siteName, children }) => {
	const router = useRouter();

	if (!image) {
		image = '/img/cat.jpg';
		imageAlt = 'An orange cat sitting down with a keyboard';
	}

	return (
		<div className="flex flex-col min-h-full">
			<Head>
				<title>
					{title} &middot; {siteName}
				</title>
				<meta name="description" content={description} />
				<meta name="author" content="ElCholoGamer" />

				<meta property="og:title" content={title} />
				<meta property="og:url" content={HOST + router.pathname} />
				<meta property="og:type" content="website" />
				<meta property="og:image" content={HOST + image} />
				<meta property="og:site_name" content={siteName} />
				{description && <meta property="og:description" content={description} />}
				{imageAlt && <meta property="og:image:alt" content={imageAlt} />}
			</Head>

			<Header />
			<div className="flex-grow">{children}</div>
			<Footer />
		</div>
	);
};

Layout.defaultProps = {
	siteName: "Cholo's Blog",
	description: "Some guy's point of view about programming and web dev.",
};

export default Layout;
