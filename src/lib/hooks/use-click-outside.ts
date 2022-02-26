import { RefObject, useEffect } from 'react';
import { Runnable } from '../types';

export function useClickOutside(fn: Runnable, ref: RefObject<HTMLElement>) {
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (!ref.current?.contains(e.target as Node)) {
				fn();
			}
		};

		document.addEventListener('click', handleClick, true);
		return () => document.removeEventListener('click', handleClick);
	}, [fn, ref]);
}
