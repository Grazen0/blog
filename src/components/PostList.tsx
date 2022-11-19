import Link from 'next/link';
import { HTMLProps } from 'react';
import { postUrl } from 'lib/utils';
import Card from './Card';
import { SerializedPopulatedPost } from 'lib/types';

export type Props = HTMLProps<HTMLUListElement> & {
	posts: SerializedPopulatedPost[];
	showCategories?: boolean;
};

const PostList: React.FC<Props> = ({ posts, showCategories, ...props }) => (
	<ul {...props}>
		{posts.map(post => (
			<li key={post.id}>
				<Link href={postUrl(post)}>
					<Card
						title={post.title}
						description={post.summary || '[No summary available]'}
						head={showCategories ? post.category.name : undefined}
						image={post.image}
						imageAlt={post.imageAlt}
						className="hover:scale-105 my-8 transition-all"
					/>
				</Link>
			</li>
		))}
	</ul>
);

PostList.defaultProps = {
	showCategories: true,
};

export default PostList;
