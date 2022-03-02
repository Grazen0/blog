import { HOST } from './constants';

export const completePath = (urlOrPath: string) =>
	urlOrPath.startsWith('http') ? urlOrPath : HOST + urlOrPath;
