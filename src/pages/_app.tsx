import { AppProps } from 'next/app';
import useDarkModeInitial from 'lib/hooks/dark-mode-initial';
import { DarkModeContext } from 'lib/providers/dark-mode';
import useAnalyticsRouting from 'lib/hooks/analytics-routing';
import 'styles/globals.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
	const [darkMode, setDarkMode] = useDarkModeInitial();
	useAnalyticsRouting();

	return (
		<DarkModeContext.Provider value={[darkMode, setDarkMode]}>
			{/* @ts-ignore */}
			<Component {...pageProps} />
		</DarkModeContext.Provider>
	);
};

export default MyApp;
