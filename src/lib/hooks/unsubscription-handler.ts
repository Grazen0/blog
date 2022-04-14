import router from 'next/router';
import { useCallback, useState } from 'react';
import axios from 'axios';

function useUnsubscriptionHandler(sid: string) {
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState<'success' | 'failed'>('success');
	const [message, setMessage] = useState<string | null>(null);

	const handleConfirm = useCallback(() => {
		setLoading(true);

		axios
			.delete(`/api/unsubscribe?sid=${sid}`)
			.then(() => {
				setStatus('success');
				setMessage("✔ Email unsubscribed successfully. You'll be redirected shortly.");
				setTimeout(() => router.push('/'), 3000);
			})
			.catch(err => {
				console.error(err);
				setStatus('failed');
				setMessage('🤯 Oops, something went wrong! Try again later.');
			})
			.finally(() => setLoading(false));
	}, [sid]);

	return {
		loading,
		status,
		message,
		handleConfirm,
	};
}

export default useUnsubscriptionHandler;
