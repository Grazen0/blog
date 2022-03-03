import { Dispatch, SetStateAction } from 'react';

export interface ImageHolder {
	image: string;
	image_alt?: string;
}

export interface Post extends Partial<ImageHolder> {
	category?: string;
	id: string;
	title: string;
	summary: string;
	date: number;
	content: string;
}

export interface Category extends Partial<ImageHolder> {
	id: string;
	name: string;
	description: string;
	image?: string;
	image_alt?: string;
}

export interface ToString {
	toString(): string;
}

export interface LinkInfo {
	to: string;
	label: string;
}

export type Runnable = () => void;
export type Mapper<V, R> = (value: V) => R;

export type SetState<T> = Dispatch<SetStateAction<T>>;
