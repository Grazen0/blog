import { HOST } from 'lib/constants';
import { Post } from 'lib/types';
import { completePath, postUrl } from 'lib/utils';
import { EmailTemplate } from '.';

export const subscriptionMessage = (subscriptionId: string): EmailTemplate => {
	return {
		subject: '🎉 Thanks for subscribing! 🎉',
		text: `
Hello there!
	
Thanks for subscribing to my blog! You'll now get notified whenever I post something.  If I could, I'd give you some choccy milk, because you deserve it ;)
	
I hope you have as much fun reading my posts as I have making them!
	
- José
`.trim(),

		html: `
	<div style="max-width:500px;margin:0 auto;background-color:rgb(15,23,42);color:white;border-radius:2rem;padding:6%;font-size:1.5rem;font-family:ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif;line-height:1.75em;">
		<a href="${HOST}" style="font-size:2rem;font-weight:bolder;color:white!important;text-decoration:none!important">Cholo's Dev Blog</a>
		<h1 style="color:#f7f252;text-align:center;margin:3.5rem 0 4rem;line-height:1.25em">Well, hello there!</h1>
	
		<p>
			Thanks for subscribing to my blog! You'll now get notified whenever I post something. If I could, I'd give you some choccy milk, because you deserve it ;)
		</p>
		<p>
			I hope you have as much fun reading my posts as I have making them. 🙌
		</p>
		<p style="text-align:right;">- José</p>
	
		
		<footer style="opacity:0.5;color:gray;font-size:0.75rem;line-height:1.75em">
		<span>Subscription ID ${subscriptionId}</span>
		<br />
		<a style="color:gray!important" href="${completePath(
			`/unsubscribe?id=${subscriptionId}`
		)}">Unsubscribe</a>
	</footer>
	</div>
	`,
	};
};

export const notification = (post: Post, subscriptionId: string): EmailTemplate => {
	const url = postUrl(post);

	return {
		subject: `📫 New post! "${post.title}"`,
		text: `
New post! "${post.title}"

${post.category ? `On category "${post.category.name}"` : ''}

"${post.summary}"

Go check it out at ${url}
`.trim(),

		html: `
<div style="max-width:500px;margin:0 auto;background-color:rgb(15,23,42);color:white;border-radius:2rem;padding:4%;font-size:1.5rem;font-family:ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif;line-height:1.75em;">
	<a href="${HOST}" style="font-size:2rem;font-weight:bolder;color:white!important;text-decoration:none!important">Cholo's Dev Blog</a>
	<h1 style="color:#f7f252;text-align:center;margin:2rem 0 3rem;line-height:1.25em;font-size:2.75rem">New post: "${
		post.title
	}"</h1>
	${
		post.category
			? `<p style="text-align:center">On <span style="font-weight:bold">${post.category.name}</span></p>`
			: ''
	}

	${
		post.image
			? `<img src="${completePath(post.image)}" alt="${
					post.image_alt || ''
			  }" style="border-radius:1rem" />`
			: ''
	}

	<p style="text-align:center;margin-top:1rem;font-size:1.3rem">${post.summary}</p>

	<p style="text-align:center;margin:3rem 0 4rem;text-align:center;font-size:1.85rem">
		<a href="${url}" style="color:white!important;font-weight:bold">👉 Go check it out! 👈</a>
	</p>

	<footer style="opacity:0.5;color:gray;font-size:0.75rem;line-height:1.75em;margin:1.5rem 0">
		<span>Subscription ID ${subscriptionId}</span>
		<br />
		<a style="color:gray!important" href="${completePath(
			`/unsubscribe?id=${subscriptionId}`
		)}">Unsubscribe</a>
	</footer>
</div>
`,
	};
};
