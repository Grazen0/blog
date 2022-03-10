import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import YAML from 'yaml';
import { Category, FullPost, Post, SortedPost } from './types';

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
		content: matterResult.content,
		category: category || null,
	};
}

export function getFullPost(category: string, id: string): FullPost {
	const post = getPost(category, id);

	return {
		...post,
		category: getCategory(category),
	};
}

export function getPosts(category: string | null): Post[] {
	return listPosts(category).map(id => getPost(category, id));
}

export function getSortedPosts(category: string | null): SortedPost[] {
	const posts = getPosts(category).sort(sortByDate);

	return posts.map((post: SortedPost, index) => {
		if (index > 0) post.prevPost = posts[index - 1];
		if (index < posts.length - 1) post.nextPost = posts[index + 1];
		return post;
	});
}

export function getSortedPost(category: string | null, id: string) {
	const posts = getPosts(category).sort(sortByDate);
	const index = posts.findIndex(post => post.id === id);

	const sortedPost: SortedPost = posts[index];
	if (index > 0) sortedPost.prevPost = posts[index - 1];
	if (index < posts.length - 1) sortedPost.nextPost = posts[index + 1];

	return sortedPost;
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

export const sortByDate = (a: Post, b: Post) =>
	new Date(a.date).getTime() - new Date(b.date).getTime();

export const sortbyDateInverse = (a: Post, b: Post) => sortByDate(b, a);
