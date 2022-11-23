import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
	pages: {
		signIn: '/admin/login',
	},
	providers: [
		CredentialsProvider({
			id: 'credentials',
			name: 'Credentials',
			credentials: {
				passcode: { label: 'Password', type: 'password' },
			},
			authorize(credentials, req) {
				if (!process.env.ADMIN_PASSCODE) throw new Error('Admin passcode missing');

				if (credentials?.passcode === process.env.ADMIN_PASSCODE) {
					return { admin: true };
				} else {
					return null;
				}
			},
		}),
	],
});
