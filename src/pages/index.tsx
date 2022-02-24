import type { NextPage } from 'next';
import Layout from '../components/layout';

const Home: NextPage = () => {
	return (
		<Layout title="Home">
			<main>
				<h1 className="text-3xl text-green-600 font-bold">Sup, world.</h1>
			</main>
		</Layout>
	);
};

export default Home;
