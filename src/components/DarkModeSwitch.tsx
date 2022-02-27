import classNames from 'classnames';
import { ChangeEventHandler, HTMLProps } from 'react';
import { useDarkMode } from 'providers/dark-mode';

export type Props = HTMLProps<HTMLSpanElement>;

const DarkModeSwitch: React.FC<Props> = ({ className, ...props }) => {
	const [darkMode, setDarkMode] = useDarkMode();

	const handleChange: ChangeEventHandler<HTMLInputElement> = e => setDarkMode(e.target.checked);

	return (
		<span className={classNames('inline-flex items-center', className)} {...props}>
			<input
				type="checkbox"
				checked={darkMode}
				onChange={handleChange}
				aria-label="Dark mode"
				className="absolute opacity-0 pointer-events-none"
			/>
			<span
				className={classNames(
					"relative cursor-pointer w-16 before:bg-neutral-400 before:dark:bg-slate-900 before:rounded-full before:transition-all before:block before:h-8 before:w-full after:content-['🌞'] dark:after:content-['🌛'] after:bg-neutral-200 after:dark:bg-slate-400 after:transition-all after:absolute after:top-1/2 after:-translate-y-1/2 after:w-6 after:h-6 after:rounded-full after:text-center",
					darkMode
						? 'after:translate-x-[calc(3.75rem-100%)]'
						: 'after:translate-x-[calc(1.75rem-100%)]'
				)}
				onClick={() => setDarkMode(prev => !prev)}
			></span>
		</span>
	);
};

export default DarkModeSwitch;
