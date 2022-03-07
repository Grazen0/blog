import Link from 'next/link';
import { HTMLProps } from 'react';
import { FullPost, Post } from 'lib/types';
import { postUrl } from 'lib/utils';
import Card from './Card';

export interface Props extends HTMLProps<HTMLUListElement> {
	posts: (Post | FullPost)[];
}

const PostList: React.FC<Props> = ({ posts, ...props }) => (
	<ul {...props}>
		{posts.map(post => (
			<li key={post.id}>
				<Link href={postUrl(post)}>
					<a>
						<Card
							title={post.title}
							description={post.summary}
							head={typeof post.category === 'string' ? undefined : post.category?.name}
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
