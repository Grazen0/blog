import { useEffect, useRef, useState } from 'react';
import { Timeout } from 'lib/types';

const useDelayedState = <T>(value: T, delay = 500) => {
	const [delayedValue, setDelayedValue] = useState(value);
	const timeout = useRef<Timeout | null>(null);

	useEffect(() => {
		if (timeout.current !== null) clearTimeout(timeout.current);
		timeout.current = setTimeout(() => setDelayedValue(value), delay);
	}, [value, delay]);

	return delayedValue;
};

export default useDelayedState;
