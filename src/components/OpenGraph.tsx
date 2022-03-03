import Head from 'next/head';
import { useRouter } from 'next/router';
import { completePath } from 'lib/utils';

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
		image = '/img/cat.jpg';
		imageAlt = 'An orange cat sitting down with a keyboard';
	}

	return (
		<Head>
			<meta property="og:title" content={title} />
			<meta property="og:url" content={completePath(router.asPath)} />
			<meta property="og:type" content="website" />
			<meta property="og:image" content={completePath(image)} />
			<meta property="og:site_name" content={siteName} />
			{description && <meta property="og:description" content={description} />}
			{imageAlt && <meta property="og:image:alt" content={imageAlt} />}
		</Head>
	);
};

export default OpenGraph;
