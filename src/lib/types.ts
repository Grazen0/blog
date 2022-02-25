import { Dispatch, SetStateAction } from 'react';

export interface ToString {
	toString(): string;
}

export type Mapper<V, R> = (value: V) => R;

export type SetState<T> = Dispatch<SetStateAction<T>>;
