import type { GetStaticProps, NextPage } from 'next';
import Layout from 'components/layout/Layout';
import PostList from 'components/PostList';
import { Post } from 'lib/types';
import { getLatestPosts } from 'lib/posts';

interface Props {
	latestPosts: Post[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	return {
		props: {
			latestPosts: getLatestPosts(5),
		},
	};
};

const Home: NextPage<Props> = ({ latestPosts }) => {
	return (
		<Layout title="Home">
			<main className="p-6">
				<h1 className="text-5xl text-center font-bold my-8">👋 Welcome to my blog!</h1>
				<p className="text-center text-lg">Glad to see you around ;)</p>

				<div className="max-w-2xl mx-auto my-12">
					<h2 className="text-2xl font-semibold">Latest posts:</h2>
					<PostList posts={latestPosts} />
				</div>
			</main>
		</Layout>
	);
};

export default Home;
