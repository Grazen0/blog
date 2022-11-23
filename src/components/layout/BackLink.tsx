import AnimatedLink, { Props as AnimatedLinkProps } from '../AnimatedLink';

export type Props = AnimatedLinkProps;

const BackLink: React.FC<Props> = ({ className, children, ...props }) => (
	<div className="mx-auto max-w-5xl text-neutral-700 dark:text-slate-400">
		<AnimatedLink {...props}>← {children}</AnimatedLink>
	</div>
);

export default BackLink;
