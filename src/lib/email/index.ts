import FormData from 'form-data';
import Mailgun from 'mailgun.js';

export interface EmailTemplate {
	subject: string;
	text: string;
	html: string;
}

const DOMAIN = 'sub.elchologamer.me';
const USER = `Cholo's Dev Blog <blog@${DOMAIN}>`;

const mailgun = new Mailgun(FormData);
const key = process.env.MAILGUN_API_KEY;
if (!key) {
	console.warn('No MailGun API key provided, emails are disabled.');
}

const client = key
	? mailgun.client({
			username: 'api',
			key,
	  })
	: null;

export const sendEmail = async (message: EmailTemplate, to: string) =>
	await client?.messages.create(DOMAIN, {
		from: USER,
		to,
		...message,
	});
