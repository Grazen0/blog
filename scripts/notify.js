const axios = require('axios').default;
const { readFileSync } = require('fs');
const matter = require('gray-matter');
const path = require('path');
const YAML = require('yaml');

const file = process.argv[2];
if (!file) throw new Error('Filename not provided');

const contents = readFileSync(file, 'utf8');
const { data } = matter(contents);

const dir = path.dirname(file);
if (!dir.endsWith('posts')) {
	const categoryFile = path.join(dir, 'category.yml');
	data.category = YAML.parse(readFileSync(categoryFile, 'utf8'));
}

console.log('Post data:', data);
