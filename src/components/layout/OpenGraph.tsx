import Head from 'next/head';
import { useRouter } from 'next/router';
import { withHost } from 'lib/utils';

export interface Props {
	title: string;
	description?: string;
	image?: string;
	siteName?: string;
	imageAlt?: string;
}

const OpenGraph: React.FC<Props> = ({ title, image, siteName, description, imageAlt }) => {
	const router = useRouter();

	if (!image) {
		image = '/og.png';
		imageAlt = 'Logo of the website';
	}

	return (
		<Head>
			<meta property="og:title" content={title} />
			<meta property="og:url" content={withHost(router.asPath)} />
			<meta property="og:type" content="website" />
			<meta property="og:image" content={withHost(image)} />
			<meta property="og:site_name" content={siteName} />
			{description && <meta property="og:description" content={description} />}
			{imageAlt && <meta property="og:image:alt" content={imageAlt} />}
		</Head>
	);
};

export default OpenGraph;
