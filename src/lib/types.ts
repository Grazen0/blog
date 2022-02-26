import { Dispatch, SetStateAction } from 'react';

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
