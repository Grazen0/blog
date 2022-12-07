import { Dispatch, SetStateAction } from 'react';

export interface LinkInfo {
	to: string;
	label: string;
}

export interface SerializedCategory {
	id: string;
	slug: string;
	name: string;
	description: string;
	image: string;
	imageAlt: string;
}

export type SerializedPost = {
	id: string;
	category: string;
	slug: string;
	title: string;
	summary: string;
	image: string;
	imageAlt: string;
	content: string;
	views: number;
	draft: boolean;
	publishedAt?: Date;
	editedAt?: Date;
};

export interface PublishedSerializedPost extends SerializedPost {
	draft: false;
	publishedAt: Date;
}

export interface SerializedPopulatedPost extends Omit<SerializedPost, 'category'> {
	category: SerializedCategory;
}

export type Runnable = () => void;
export type SetState<T> = Dispatch<SetStateAction<T>>;
export type Timeout = ReturnType<typeof setTimeout>;
