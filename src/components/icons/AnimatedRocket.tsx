import { useAnimationFrame } from 'lib/hooks/use-animation-frame';
import { randomRange } from 'lib/utils';
import { useEffect, useRef, useState } from 'react';

const AnimatedRocket: React.FC = () => {
	const [leftStart, setLeftStart] = useState(0);
	const [left, setLeft] = useState(0);
	const [bottom, setBottom] = useState(-10);
	const ySpeed = useRef(0);
	const xSpeed = useRef(0);
	const acceleration = useRef(0);

	function reset() {
		xSpeed.current = randomRange(100, 180);
		ySpeed.current = randomRange(30, 60);
		acceleration.current = randomRange(0.1, 0.3);
		setLeftStart(randomRange(-20, 100));
		setLeft(0);
	}

	useEffect(reset, []);

	useAnimationFrame(delta => {
		setBottom(bottom => {
			bottom += ySpeed.current * delta;
			ySpeed.current += acceleration.current;
			if (bottom >= 100) {
				bottom = -15;
				reset();
			}

			return bottom;
		});

		setLeft(left => left + xSpeed.current * delta);
	});

	return (
		<span
			className="absolute z-0 text-3xl md:text-5xl"
			style={{ left: `calc(${leftStart}% + ${left}px)`, bottom: bottom + '%' }}
		>
			🚀
		</span>
	);
};

export default AnimatedRocket;
