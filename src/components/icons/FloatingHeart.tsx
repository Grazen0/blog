import { useAnimationFrame } from 'lib/hooks/use-animation-frame';
import { randomRange } from 'lib/utils';
import { useEffect, useRef, useState } from 'react';

export interface Props {
	reset: boolean;
}

const FloatingHeart: React.FC<Props> = ({ reset }) => {
	const [left, setLeft] = useState(0);
	const [top, setTop] = useState<number>(-20);
	const speed = useRef(0);

	useAnimationFrame(delta => {
		setTop(t => t - speed.current * delta);
		speed.current *= 1.01;
	});

	useEffect(() => {
		if (!reset) return;

		setLeft(Math.random() * window.innerWidth);
		setTop(randomRange(100, 180));
		speed.current = randomRange(50, 60);
	}, [reset]);

	return (
		<div className={'fixed z-50 text-4xl'} style={{ left, top: `${top}%` }}>
			❤
		</div>
	);
};

export default FloatingHeart;
