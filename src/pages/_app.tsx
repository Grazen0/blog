import type { AppProps } from 'next/app';
import { useState } from 'react';
import useDarkModeinitial from '../lib/hooks/use-dark-mode-initial';
import { DarkModeContext } from '../providers/dark-mode';
import '../styles/globals.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
	const [darkMode, setDarkMode] = useDarkModeinitial();

	return (
		<DarkModeContext.Provider value={[darkMode, setDarkMode]}>
			<Component {...pageProps} />
		</DarkModeContext.Provider>
	);
};

export default MyApp;
