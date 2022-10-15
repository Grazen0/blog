import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import YAML from 'yaml';
import { Category, Post, PartialPost, Sorted, HasDate } from './types';

const POSTS_DIR = 'posts';

const fileToPostId = (file: string) => path.basename(file).replace(/\.md$/, '');

const postFilePath = (postId: string, categoryId: string | null) =>
	path.join(POSTS_DIR, categoryId || '', `${postId}.md`);

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

export function getPartialPost(category: string | null, id: string): PartialPost {
	category ||= '';
	const content = fs.readFileSync(postFilePath(id, category));

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

export function getPost(category: string | null, id: string): Post {
	const post = getPartialPost(category, id);
	const fullPost = post as Post;

	if (post.category) fullPost.category = getCategory(post.category);
	return fullPost;
}

export const getPosts = (category: string | null): Post[] =>
	listPosts(category).map(id => getPost(category, id));

export const getPartialPosts = (category: string | null): PartialPost[] =>
	listPosts(category).map(id => getPartialPost(category, id));

export function getSortedPosts(category: string | null): Sorted<PartialPost>[] {
	const posts = getPartialPosts(category).sort(sortByDate);

	return posts.map((post: Sorted<PartialPost>, index) => {
		if (index > 0) post.prevPost = posts[index - 1];
		if (index < posts.length - 1) post.nextPost = posts[index + 1];
		return post;
	});
}

export function getSortedPost(category: string | null, id: string) {
	const posts = getPosts(category).sort(sortByDate);
	const index = posts.findIndex(post => post.id === id);

	const sortedPost: Sorted<Post> = posts[index];
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
					if (post.category) {
					}
					out.push(post);
					break;
				}

				if (out[i].date < post.date) {
					out.splice(i, 0, post);
					out.length = Math.min(out.length, max);
					break;
				}
			}
		}
	}

	return out;
}

export const sortByDate = (a: HasDate, b: HasDate) =>
	new Date(a.date).getTime() - new Date(b.date).getTime();

export const sortbyDateInverse = (a: HasDate, b: HasDate) => sortByDate(b, a);

export const doesPostExist = (postId: string, categoryId: string | null) =>
	fs.existsSync(postFilePath(postId, categoryId));
