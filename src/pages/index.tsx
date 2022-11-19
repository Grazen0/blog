import type { GetStaticProps, NextPage } from 'next';
import Layout from 'components/layout/Layout';
import { getLatestPosts } from 'lib/posts';
import { connect as db } from 'lib/database';
import { SerializedPopulatedPost } from 'lib/types';
import AnimatedRocket from 'components/icons/AnimatedRocket';
import { postUrl } from 'lib/utils';
import ImageCard from 'components/ImageCard';

interface Props {
	latestPosts: SerializedPopulatedPost[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	await db();
	const latestPosts = await getLatestPosts(10);

	return {
		props: {
			latestPosts: latestPosts.map(post => post.serializable()),
		},
	};
};

const Home: NextPage<Props> = ({ latestPosts }) => (
	<Layout title="Home">
		<main>
			<div className="block bg-neutral-100 dark:bg-slate-950 relative overflow-hidden text-center [box-shadow:inset_0_8px_10px_-10px_gray,inset_0_-4px_15px_-10px_gray] dark:shadow-none">
				<h1 className="relative text-neutral-900 dark:text-white inline-block text-4xl sm:text-5xl md:text-6xl sm:leading-snug md:leading-snug text-center font-extrabold mx-10 my-12 md:my-20 p-5 leading-snug z-30 [text-shadow:#717171_0_0_8px] max-w-5xl animate-hover">
					The blog of a guy who likes programming <em>a bit</em> too much
				</h1>
				{[...Array(6)].map((_, i) => (
					<AnimatedRocket key={i} />
				))}
			</div>
			<ul className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
				{latestPosts.map(post => (
					<li key={post.id}>
						<ImageCard
							link={postUrl(post)}
							head={post.category.name}
							title={post.title}
							subtitle={post.summary || '(No summary available)'}
							image={post.image}
							imageAlt={post.imageAlt}
						/>
					</li>
				))}
			</ul>
		</main>
	</Layout>
);

export default Home;
