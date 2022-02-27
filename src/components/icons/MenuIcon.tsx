import { useDarkMode } from 'providers/dark-mode';

export interface Props {
	width?: number;
	height?: number;
	className?: string;
}

const MenuIcon: React.FC<Props> = props => {
	const [darkMode] = useDarkMode();

	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" {...props}>
			<path
				d="M 12 15 h 26 m -26 10 h 26 m -26 10 h 26"
				stroke={darkMode ? 'white' : 'black'}
				strokeLinecap="round"
				strokeWidth={3}
				className="transition-all"
			/>
		</svg>
	);
};

export default MenuIcon;
