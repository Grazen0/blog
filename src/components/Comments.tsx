import { useDarkMode } from 'lib/providers/dark-mode';
import { HTMLProps, useEffect, useRef } from 'react';

const Comments: React.FC<HTMLProps<HTMLDivElement>> = props => {
	const [darkMode] = useDarkMode();
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const script = document.createElement('script');
		script.src = 'https://giscus.app/client.js';
		script.async = true;
		script.crossOrigin = 'anonymous';
		script.setAttribute('data-repo', 'ElCholoGamer/blog');
		script.setAttribute('data-repo-id', 'R_kgDOG5iLiQ');
		script.setAttribute('data-category', 'Comments');
		script.setAttribute('data-category-id', 'DIC_kwDOG5iLic4CS8tV');
		script.setAttribute('data-mapping', 'pathname');
		script.setAttribute('data-strict', '1');
		script.setAttribute('data-reactions-enabled', '1');
		script.setAttribute('data-emit-metadata', '0');
		script.setAttribute('data-input-position', 'top');
		script.setAttribute('data-theme', darkMode ? 'dark_dimmed' : 'light');
		script.setAttribute('data-lang', 'en');

		container.appendChild(script);

		return () => {
			script.remove();
			container.textContent = '';
		};
	}, [darkMode]);

	return <div {...props} ref={containerRef}></div>;
};

export default Comments;
