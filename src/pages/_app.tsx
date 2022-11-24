import { AppProps } from 'next/app';
import useDarkModeInitial from 'lib/hooks/dark-mode-initial';
import { DarkModeContext } from 'lib/providers/dark-mode';
import useAnalyticsRouting from 'lib/hooks/analytics-routing';
import { SessionProvider } from 'next-auth/react';
import 'styles/globals.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
	const [darkMode, setDarkMode] = useDarkModeInitial();
	useAnalyticsRouting();

	return (
		<DarkModeContext.Provider value={[darkMode, setDarkMode]}>
			<SessionProvider session={session}>
				{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
				{/* @ts-ignore */}
				<Component {...pageProps} />
			</SessionProvider>
		</DarkModeContext.Provider>
	);
};

export default MyApp;
