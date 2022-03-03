import { pageView } from 'lib/gtag';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function useAnalyticsRouting() {
	const router = useRouter();

	useEffect(() => {
		router.events.on('routeChangeComplete', pageView);
		return () => {
			router.events.off('routeChangeComplete', pageView);
		};
	}, [router.events]);
}

export default useAnalyticsRouting;
