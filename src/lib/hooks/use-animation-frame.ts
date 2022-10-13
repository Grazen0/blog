import { useEffect, useRef } from 'react';

export function useAnimationFrame(callback: (deltaTime: number) => void) {
	const handleRef = useRef<number | null>(null);
	const previousTimeRef = useRef<number | null>(null);

	function animate(time: number) {
		if (previousTimeRef.current !== null) {
			callback((time - previousTimeRef.current) / 1000);
		}

		previousTimeRef.current = time;
		handleRef.current = requestAnimationFrame(animate);
	}

	useEffect(() => {
		handleRef.current = requestAnimationFrame(animate);

		return () => {
			if (handleRef.current !== null) {
				cancelAnimationFrame(handleRef.current);
			}
		};
	});
}
