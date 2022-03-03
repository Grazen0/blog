import Link from 'next/link';
import { formatDate } from 'lib/date';
import { Post } from 'lib/types';
import Card from './Card';
import { HTMLProps } from 'react';

export interface Props extends HTMLProps<HTMLUListElement> {
	posts: Post[];
}

const PostList: React.FC<Props> = ({ posts, ...props }) => (
	<ul {...props}>
		{posts.map(post => (
			<li key={post.id}>
				<Link href={post.category ? `/posts/${post.category}/${post.id}` : `/posts/${post.id}`}>
					<a>
						<Card
							title={post.title}
							description={post.summary}
							footer={formatDate(new Date(post.date))}
							image={post.image}
							imageAlt={post.image_alt}
							className="hover:scale-105 transition-all"
						/>
					</a>
				</Link>
			</li>
		))}
	</ul>
);

export default PostList;
