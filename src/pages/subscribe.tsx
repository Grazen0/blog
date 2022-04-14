import { NextPage } from 'next';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Layout from 'components/layout/Layout';
import Spinner from 'components/icons/Spinner';
import classNames from 'classnames';

const Subscribe: NextPage = () => {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState<'success' | 'warning' | 'failed'>('warning');
	const [message, setMessage] = useState<string | null>(null);

	const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
		setEmail(e.target.value.trimStart());
	};

	const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
		e.preventDefault();
		if (!email) return;

		setLoading(true);
		axios
			.post('/api/subscribe', { email })
			.then(() => {
				setEmail('');
				setStatus('success');
				setMessage('Done! Check your email for a confirmation message 🥳');
			})
			.catch((err: AxiosError) => {
				console.error(err);
				setStatus('failed');

				switch (err.response?.status) {
					case 400:
						setMessage('This email is invalid 🤔');
						break;
					case 409:
						setMessage('This email is already subscribed 😎');
						setStatus('warning');
						break;
					default:
						setMessage('Oops, something went wrong! 🤯 Try again later');
				}
			})
			.finally(() => setLoading(false));
	};

	return (
		<Layout title="Subscribe">
			<main className="p-8 text-center">
				<h1 className="font-bold text-5xl sm:mt-16 mt-8 mx-auto leading-snug max-w-4xl">
					📫 Get new posts sent directly to your inbox!
				</h1>
				<p className="my-4">
					<small>(Just don&apos;t put them on spam pls)</small>
				</p>

				<form onSubmit={handleSubmit} className="my-10">
					<input
						type="email"
						name="email"
						value={email}
						onChange={handleChange}
						placeholder="johndoe@example.com"
						size={35}
						className="rounded-full my-8 px-4 py-2 text-md text-neutral-900 bg-neutral-300 dark:bg-neutral-100"
					/>
					<br />
					<button
						type="submit"
						disabled={loading}
						className="flex items-center mx-auto bg-cyan-600 rounded-lg text-xl font-semibold px-4 py-2 cursor-pointer transition-all duration-[50ms] outline outline-0 focus:outline-[3px] outline-cyan-400 active:brightness-[1.15] disabled:brightness-75 disabled:cursor-not-allowed disabled:outline-0"
					>
						{loading ? <Spinner /> : '📝 Submit'}
					</button>
				</form>
				{message && (
					<div className="mt-20 mb-10 max-w-full">
						<span
							className={classNames(
								'inline-block text-lg text-center font-semibold max-w-3xl mx-auto py-4 px-8 rounded-lg border',
								status === 'success'
									? 'text-green-500 border-green-300 bg-green-200'
									: status === 'warning'
									? 'text-yellow-500 border-yellow-400 bg-yellow-200'
									: 'text-red-500 border-red-400 bg-red-200'
							)}
						>
							{message}
						</span>
					</div>
				)}
			</main>
		</Layout>
	);
};

export default Subscribe;
