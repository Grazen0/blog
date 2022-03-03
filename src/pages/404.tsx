import AnimatedLink from 'components/AnimatedLink';
import Layout from 'components/layout/Layout';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';

const NotFound: NextPage = () => {
	const router = useRouter();

	const goBack = () => router.back();

	return (
		<Layout title="Page Not Found" description="Maybe you misspelled something?">
			<main className="p-6">
				<h1 className="text-5xl text-center my-8 font-bold">Page Not found :(</h1>
				<p className="text-center text-xl">Maybe you misspelled something?</p>

				<div className="text-center mx-auto my-20">
					<AnimatedLink className="mx-4 text-lg font-semibold" href="/">
						Home
					</AnimatedLink>
					<AnimatedLink className="mx-4 text-lg font-semibold" href="" onClick={goBack}>
						Go back
					</AnimatedLink>
				</div>
			</main>
		</Layout>
	);
};

export default NotFound;
