import { GA_TRACKING_ID } from 'lib/gtag';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	public render() {
		return (
			<Html>
				<Head>
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
					<link
						href="https://fonts.googleapis.com/css2?family=Rubik:wght@700&display=swap"
						rel="stylesheet"
					/>

					{GA_TRACKING_ID && (
						<>
							<script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
							<script
								dangerouslySetInnerHTML={{
									__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
								}}
							/>
						</>
					)}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
