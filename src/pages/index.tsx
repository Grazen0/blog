import type { GetStaticProps, NextPage } from 'next';
import Layout from 'components/layout/Layout';
import PostList from 'components/PostList';
import { getLatestPosts } from 'lib/posts';
import { connect as db } from 'lib/database';
import { SerializedPopulatedPost } from 'lib/types';

interface Props {
	latestPosts: SerializedPopulatedPost[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	await db();
	const latestPosts = await getLatestPosts(5);

	return {
		props: {
			latestPosts: latestPosts.map(post => post.serializable()),
		},
	};
};

const Home: NextPage<Props> = ({ latestPosts }) => (
	<Layout title="Home">
		<main className="p-6">
			<h1 className="text-5xl text-center font-bold my-8 leading-snug">👋 Welcome to my blog!</h1>
			<p className="text-center text-lg">Glad to see you around ;)</p>

			<div className="max-w-2xl mx-auto my-12">
				<h2 className="text-2xl font-semibold">📰 Latest posts</h2>
				<PostList posts={latestPosts} />
			</div>
		</main>
	</Layout>
);

export default Home;
