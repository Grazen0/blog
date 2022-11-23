import { HTMLProps, useRef, useState } from 'react';
import { SerializedCategory, SerializedPost, Timeout } from 'lib/types';
import { withHost, postUrl } from 'lib/utils';
import AnimatedLink from './AnimatedLink';
import classNames from 'classnames';

export interface Props extends HTMLProps<HTMLDivElement> {
	post: SerializedPost;
	category: SerializedCategory;
}

const ShareSection: React.FC<Props> = ({ post, category, ...props }) => {
	const handle = useRef<Timeout | null>(null);
	const [status, setStatus] = useState<'none' | 'copied' | 'error'>('none');

	const url = withHost(postUrl(post, category));

	const handleClick = () => {
		if (handle.current !== null) clearTimeout(handle.current);

		if ('clipboard' in navigator) {
			navigator.clipboard.writeText(url);
			setStatus('copied');
		} else {
			setStatus('error');
		}

		handle.current = setTimeout(() => setStatus('none'), 1500);
	};

	return (
		<aside {...props}>
			<p>
				📣 Share on:{' '}
				<AnimatedLink
					external
					className="font-semibold"
					href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
						`"${post.title}" on Cholo's Dev Blog: ${url}`
					)}`}
				>
					Twitter
				</AnimatedLink>{' '}
				&middot;{' '}
				<AnimatedLink
					external
					className="font-semibold"
					href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
				>
					Facebook
				</AnimatedLink>
			</p>
			<button onClick={handleClick}>
				🔗{' '}
				<span
					className={classNames(
						status === 'copied' && 'text-green-400',
						status === 'error' && 'text-red-500',
						'font-semibold transition-colors'
					)}
				>
					{status === 'none'
						? 'Copy link'
						: status === 'copied'
						? 'Link copied!'
						: 'Could not copy link :('}
				</span>
			</button>
		</aside>
	);
};

export default ShareSection;
