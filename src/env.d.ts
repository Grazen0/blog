declare global {
	module 'next-auth' {
		type User = {
			admin: boolean;
		};
	}
}
