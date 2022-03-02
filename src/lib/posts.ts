import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import YAML from 'yaml';
import { Category, Post } from './types';
import { parseDate } from './date';

const POSTS_DIR = 'posts';

const fileToPostId = (file: string) => path.basename(file).replace(/\.md$/, '');

export function listCategories(): string[] {
	const items = fs.readdirSync(POSTS_DIR);
	return items.filter(item => fs.statSync(path.join(POSTS_DIR, item)).isDirectory());
}

export function listPosts(category: string | null): string[] {
	const items = fs.readdirSync(path.join(POSTS_DIR, category || ''));
	const postFiles = items.filter(file => file.endsWith('.md'));

	return postFiles.map(fileToPostId);
}

export function isCategory(categoryOrPost: string) {
	const dir = path.join(POSTS_DIR, categoryOrPost);
	return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

export function getCategory(category: string): Category {
	const infoPath = path.join(POSTS_DIR, category, 'category.yml');
	const content = fs.readFileSync(infoPath).toString();

	return YAML.parse(content);
}

export function getPost(category: string | null, id: string): Post {
	category ||= '';
	const content = fs.readFileSync(path.join(POSTS_DIR, category, `${id}.md`));

	const matterResult = matter(content, { language: 'yaml' });
	const info: any = matterResult.data;

	info.summary ||= 'No summary available.';

	return {
		...info,
		id,
		date: parseDate(info.date).getTime(),
		content: matterResult.content,
		category: category || null,
	};
}
