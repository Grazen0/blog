import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEventHandler, useState } from 'react';
import { signIn } from 'next-auth/react';
import Layout from 'components/layout/Layout';
import Button from 'components/Button';
import TextInput from 'components/form/TextInput';

const Login: NextPage = () => {
	const router = useRouter();
	const [passcode, setPasscode] = useState('');
	const [loading, setLoading] = useState(false);

	const onSubmit: FormEventHandler = async e => {
		e.preventDefault();
		if (!passcode) return;

		setLoading(true);
		await signIn('credentials', {
			passcode,
			callbackUrl: router.query.callbackUrl?.toString(),
		});
	};

	return (
		<Layout title="Admin login">
			<main className="p-6">
				<h1 className="font-bold text-5xl text-center my-8">🕵️‍♂️ Admin login</h1>
				<form onSubmit={onSubmit} className="text-center p-4">
					<TextInput
						type="password"
						value={passcode}
						onChange={e => setPasscode(e.target.value)}
						placeholder="Passcode..."
						className="w-[inherit]"
					/>
					<br />
					<Button type="submit" disabled={loading}>
						Log in
					</Button>
				</form>
			</main>
		</Layout>
	);
};

export default Login;
