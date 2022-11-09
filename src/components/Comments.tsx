import { useDarkMode } from 'lib/providers/dark-mode';
import { HTMLProps, useEffect, useRef } from 'react';

const Comments: React.FC<HTMLProps<HTMLDivElement>> = props => {
	const [darkMode] = useDarkMode();
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const script = document.createElement('script');
		script.src = 'https://utteranc.es/client.js';
		script.async = true;
		script.crossOrigin = 'anonymous';
		script.setAttribute('theme', `github-${darkMode ? 'dark' : 'light'}`);
		script.setAttribute('issue-term', 'pathname');
		script.setAttribute('repo', 'ElCholoGamer/blog');
		script.setAttribute('label', 'comments');

		container.appendChild(script);

		return () => {
			script.remove();
			container.textContent = '';
		};
	}, [darkMode]);

	return <div {...props} ref={containerRef}></div>;
};

export default Comments;
