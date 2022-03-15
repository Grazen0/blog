import { Dispatch, SetStateAction } from 'react';

export interface ImageHolder {
	image: string;
	image_alt?: string;
}

export interface HasDate {
	date: string;
}

export interface PartialPost extends Partial<ImageHolder>, HasDate {
	category?: string;
	id: string;
	title: string;
	summary: string;
	content: string;
}

export type Sorted<T extends {}> = T & {
	prevPost?: T;
	nextPost?: T;
};

export interface Post extends Omit<PartialPost, 'category'> {
	category?: Category;
}

export interface Category extends Partial<ImageHolder> {
	id: string;
	name: string;
	description: string;
	image?: string;
	image_alt?: string;
}

export interface LinkInfo {
	to: string;
	label: string;
}

export type Runnable = () => void;
export type SetState<T> = Dispatch<SetStateAction<T>>;
export type Timeout = ReturnType<typeof setTimeout>;
