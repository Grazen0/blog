import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from 'components/layout/Layout';
import Subscription from 'lib/database/models/subscription';
import Button from 'components/Button';
import { connect as db } from 'lib/database';
import { useState } from 'react';
import axios from 'axios';
import Spinner from 'components/icons/Spinner';
import Alert from 'components/Alert';
import useUnsubscriptionHandler from 'lib/hooks/unsubscription-handler';

interface Props {
	sid: string;
	email: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
	if (!query.sid) {
		return {
			redirect: { destination: '/', permanent: false },
		};
	}

	await db();
	const subscription = await Subscription.findById(query.sid);

	if (!subscription) {
		return {
			redirect: { destination: '/', permanent: false },
		};
	}

	return {
		props: {
			sid: subscription.id,
			email: subscription.email,
		},
	};
};

const Unsubscribe: NextPage<Props> = ({ sid, email }) => {
	const { loading, status, message, handleConfirm } = useUnsubscriptionHandler(sid);
	const router = useRouter();

	return (
		<Layout title="Unsubscribe">
			<main className="p-8 text-center">
				<h1 className="text-5xl font-bold mt-6 mb-16">📮 Unsubscribe</h1>
				<p className="text-xl my-16">
					Are you sure you want to stop receiving new content at{' '}
					<span className="font-semibold">{email}</span>?
				</p>

				<div className="my-12 flex justify-center">
					<Button border onClick={() => router.back()} disabled={loading} className="mx-4 text-xl">
						No, don&apos;t do it!
					</Button>
					<Button color="red" onClick={handleConfirm} disabled={loading} className="mx-4 text-xl">
						{loading ? <Spinner aria-label="Loading..." /> : 'Yes, I want to unsubscribe'}
					</Button>
				</div>

				{message && <Alert color={status === 'success' ? 'green' : 'red'}>{message}</Alert>}
			</main>
		</Layout>
	);
};

export default Unsubscribe;
