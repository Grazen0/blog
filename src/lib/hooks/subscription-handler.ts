import axios, { AxiosError } from 'axios';
import { SubmitStatus } from 'lib/constants';
import { SetState } from 'lib/types';
import { FormEventHandler, useCallback, useState } from 'react';

function useSubscriptionHandler(email: string, setEmail: SetState<string>) {
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState(SubmitStatus.WARNING);
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
					setStatus(SubmitStatus.SUCCESS);
					setMessage('Done! Check your email for a confirmation message. 🥳');
				})
				.catch((err: AxiosError) => {
					console.error(err);
					setStatus(SubmitStatus.FAILED);

					switch (err.response?.status) {
						case 400:
							setMessage('This email is invalid! 🤔');
							break;
						case 409:
							setMessage('Hey, this email is already subscribed. 😎');
							setStatus(SubmitStatus.WARNING);
							break;
						default:
							setMessage('Oops, something went wrong! 🤯 Try again later.');
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
