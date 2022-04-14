import axios, { AxiosError } from 'axios';
import { SetState } from 'lib/types';
import { FormEventHandler, useCallback, useState } from 'react';

function useSubscriptionHandler(email: string, setEmail: SetState<string>) {
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState<'success' | 'warning' | 'failed'>('warning');
	const [message, setMessage] = useState<string | null>(null);

	const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
		e => {
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
		},
		[email, setEmail]
	);

	return {
		status,
		loading,
		message,
		handleSubmit,
	};
}

export default useSubscriptionHandler;
