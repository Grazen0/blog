import { HTMLProps } from 'react';

export type Props = HTMLProps<HTMLSpanElement>;

const Spinner: React.FC<Props> = props => (
	<span
		{...props}
		className="inline-block w-7 h-7 border-4 border-white border-b-transparent rounded-full animate-spin"
	></span>
);

export default Spinner;
