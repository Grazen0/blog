import { GA_TRACKING_ID } from 'lib/gtag';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	public render() {
		return (
			<Html>
				<Head>
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
