import Image from 'next/image';
import { ChangeEventHandler, HTMLProps } from 'react';
import TextInput from './TextInput';
import useDelayedState from 'lib/hooks/delayed-state';
import classNames from 'classnames';

export interface Props extends HTMLProps<HTMLDivElement> {
	src: string;
	onSrcChange: ChangeEventHandler<HTMLInputElement>;
	alt: string;
	onAltChange: ChangeEventHandler<HTMLInputElement>;
}

const ImageInput: React.FC<Props> = ({
	src,
	alt,
	onSrcChange,
	onAltChange,
	className,
	...props
}) => {
	const imagePreviewSrc = useDelayedState(src);

	return (
		<div {...props} className={classNames(className, 'grid grid-cols-1 sm:grid-cols-2 gap-4 my-4')}>
			<div>
				<label htmlFor="image-src" className="font-semibold">
					Image source
				</label>
				<TextInput
					id="image-src"
					required
					value={src}
					onChange={onSrcChange}
					placeholder="Image URL..."
				/>
				<label htmlFor="image-alt" className="font-semibold">
					Alt text
				</label>
				<TextInput
					id="image-alt"
					value={alt}
					onChange={onAltChange}
					placeholder="Image alt text..."
				/>
			</div>
			<div className="w-full h-48 xs:h-64 sm:h-full relative">
				<Image
					src={imagePreviewSrc}
					alt={alt}
					fill
					className="object-cover rounded-md bg-neutral-300 dark:bg-slate-800 flex justify-center items-center"
				/>
			</div>
		</div>
	);
};

export default ImageInput;
