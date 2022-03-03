import type { AppProps } from 'next/app';
import useDarkModeinitial from 'lib/hooks/use-dark-mode-initial';
import { DarkModeContext } from 'lib/providers/dark-mode';
import useAnalyticsRouting from 'lib/hooks/use-analytics-routing';
import 'styles/globals.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
	const [darkMode, setDarkMode] = useDarkModeinitial();
	useAnalyticsRouting();

	return (
		<DarkModeContext.Provider value={[darkMode, setDarkMode]}>
			<Component {...pageProps} />
		</DarkModeContext.Provider>
	);
};

export default MyApp;
