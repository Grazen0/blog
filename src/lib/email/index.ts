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
const client = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_API_KEY || '',
});

export const sendEmail = (message: EmailTemplate, to: string) =>
	client.messages.create(DOMAIN, {
		from: USER,
		to,
		...message,
	});
