import { Dispatch, SetStateAction, useEffect, useState } from 'react';

function useLocalStorage<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
	const [value, setValue] = useState(defaultValue);

	useEffect(() => {
		const storedValue = localStorage.getItem(key);
		if (storedValue !== null) {
			setValue(JSON.parse(storedValue));
		}
	}, [key]);

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue];
}

export default useLocalStorage;
