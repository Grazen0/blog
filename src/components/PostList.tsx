import Link from 'next/link';
import { HTMLProps } from 'react';
import { Post, PartialPost } from 'lib/types';
import { postUrl } from 'lib/utils';
import Card from './Card';

export interface Props extends HTMLProps<HTMLUListElement> {
	posts: (PartialPost | Post)[];
	showCategories?: boolean;
}

const PostList: React.FC<Props> = ({ posts, showCategories, ...props }) => (
	<ul {...props}>
		{posts.map(post => (
			<li key={post.id}>
				<Link href={postUrl(post)}>
					<a>
						<Card
							title={post.title}
							description={post.summary}
							head={
								showCategories && typeof post.category !== 'string'
									? post.category?.name
									: undefined
							}
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

PostList.defaultProps = {
	showCategories: true,
};

export default PostList;
