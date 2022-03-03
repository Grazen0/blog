import { useEffect } from 'react';
import { SetState } from '../types';
import useLocalStorage from './use-local-storage';

export const DARK_CLASS = 'dark';

function useDarkModeinitial(): [boolean, SetState<boolean>] {
	const [darkMode, setDarkMode] = useLocalStorage('dark_mode', true);

	useEffect(() => {
		const { classList } = document.documentElement;
		if (darkMode) classList.add(DARK_CLASS);
		else classList.remove(DARK_CLASS);
	}, [darkMode]);

	return [darkMode, setDarkMode];
}

export default useDarkModeinitial;
