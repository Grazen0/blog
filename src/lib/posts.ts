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

	const info = YAML.parse(content);

	return {
		...info,
		id: category,
	};
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

export function getLatestPosts(max: number): Post[] {
	const out: Post[] = [];
	const categories = [null, ...listCategories()];

	for (const category of categories) {
		const posts = listPosts(category).map(id => getPost(category, id));

		for (const post of posts) {
			for (let i = 0; i < max; i++) {
				if (i >= out.length) {
					out.push(post);
					break;
				}

				if (out[i].date < post.date) {
					out.splice(i, 0, post);
					break;
				}
			}
		}
	}

	return out;
}
