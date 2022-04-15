const axios = require('axios').default;
const { readFileSync } = require('fs');
const matter = require('gray-matter');
const path = require('path');
const YAML = require('yaml');

if (!process.env.ADMIN_KEY) throw new Error('Missing admin key');

const file = process.argv[2];
if (!file) throw new Error('Filename not provided');

console.log('Reading post file', file);

const contents = readFileSync(file, 'utf8');
const { data } = matter(contents);

const dir = path.dirname(file);
if (!dir.endsWith('posts')) {
	const categoryFile = path.join(dir, 'category.yml');
	console.log('Reading category file', categoryFile);

	data.category = YAML.parse(readFileSync(categoryFile, 'utf8'));
}

console.log('Sending POST request to server...');
axios
	.post('https://blog.elchologamer.me/api/notify', data, {
		headers: {
			Authorization: process.env.ADMIN_KEY,
		},
	})
	.then(() => console.log(`Notified post "${data.title}"`))
	.catch(console.error);
