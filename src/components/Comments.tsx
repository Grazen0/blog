import Giscus from '@giscus/react';
import { useDarkMode } from 'lib/providers/dark-mode';
import { HTMLProps } from 'react';

const Comments: React.FC<HTMLProps<HTMLDivElement>> = props => {
	const [darkMode] = useDarkMode();

	return (
		<div {...props}>
			<Giscus
				repo="ElCholoGamer/blog"
				repoId="R_kgDOG5iLiQ"
				category="Comments"
				categoryId="DIC_kwDOG5iLic4CS8tV"
				mapping="pathname"
				strict="1"
				reactionsEnabled="1"
				emitMetadata="0"
				inputPosition="top"
				theme={darkMode ? 'dark_dimmed' : 'light'}
				lang="en"
			/>
		</div>
	);
};

export default Comments;
