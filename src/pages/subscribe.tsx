import { NextPage } from 'next';
import { ChangeEventHandler, useState } from 'react';
import useSubscriptionHandler from 'lib/hooks/subscription-handler';
import Layout from 'components/layout/Layout';
import Spinner from 'components/icons/Spinner';
import Button from 'components/Button';
import Alert from 'components/Alert';
import { SubmitStatus } from 'lib/constants';
import FloatingHeart from 'components/icons/FloatingHeart';
import TextInput from 'components/form/TextInput';

const Subscribe: NextPage = () => {
	const [email, setEmail] = useState('');
	const { status, loading, message, handleSubmit } = useSubscriptionHandler(email, setEmail);

	const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
		setEmail(e.target.value.trimStart());
	};

	return (
		<Layout title="Subscribe">
			<main className="p-8 text-center">
				<h1 className="font-bold text-5xl sm:mt-16 mt-8 mx-auto leading-snug max-w-4xl">
					📫 Get new posts sent directly to your inbox!
				</h1>
				<p className="text-2xl my-6">It&apos;s free!</p>

				<form onSubmit={handleSubmit} className="my-10">
					<TextInput
						type="email"
						name="email"
						value={email}
						onChange={handleChange}
						placeholder="johndoe@example.com"
						size={35}
						className="max-w-full w-[inherit] rounded-full"
					/>
					<br />
					<Button type="submit" disabled={loading || !email} color="blue" className="text-xl">
						{loading ? <Spinner /> : '📝 Subscribe'}
					</Button>
				</form>
				{message && (
					<Alert
						color={
							status === SubmitStatus.SUCCESS
								? 'green'
								: status === SubmitStatus.WARNING
								? 'yellow'
								: 'red'
						}
					>
						{message}
					</Alert>
				)}
			</main>
			{[...Array(15)].map((_, i) => (
				<FloatingHeart key={i} reset={status === SubmitStatus.SUCCESS} />
			))}
		</Layout>
	);
};

export default Subscribe;
