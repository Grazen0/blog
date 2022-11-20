import { GetServerSideProps, NextPage } from 'next';
import Layout from 'components/layout/Layout';
import Subscription from 'lib/database/models/subscription';
import { connect as db } from 'lib/database';
import Button from 'components/Button';
import { signOut } from 'next-auth/react';
import Post from 'lib/database/models/post';
import Category from 'lib/database/models/category';

interface Props {
	subscriberCount: number;
	postCount: number;
	categoryCount: number;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	await db();
	const subscriberCount = await Subscription.countDocuments();
	const postCount = await Post.countDocuments();
	const categoryCount = await Category.countDocuments();

	return {
		props: {
			subscriberCount,
			postCount,
			categoryCount,
		},
	};
};

const Admin: NextPage<Props> = ({ subscriberCount, postCount, categoryCount }) => {
	return (
		<Layout title="Admin">
			<main className="p-6 text-lg text-center">
				<h1 className="font-bold text-center text-5xl my-12">💻 Admin panel</h1>
				<div className="my-20">
					<h2 className="text-2xl">Current subscribers</h2>
					<p className="my-4 text-8xl">{subscriberCount}</p>
				</div>
				<div className="my-16 grid grid-cols-1 sm:grid-cols-2 gap-y-16 max-w-3xl mx-auto">
					<div>
						<h2>Total posts</h2>
						<p className="my-4 text-6xl">{postCount}</p>
					</div>
					<div>
						<h2>Total categories</h2>
						<p className="my-4 text-6xl">{categoryCount}</p>
					</div>
				</div>
				<Button className="text-2xl font-semibold" href="/admin/categories">
					Go to categories
				</Button>
				<br />
				<Button color="red" border onClick={() => signOut()} className="my-12">
					Log out
				</Button>
			</main>
		</Layout>
	);
};

export default Admin;
