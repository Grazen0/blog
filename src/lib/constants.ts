import resolveConfig from 'tailwindcss/resolveConfig';
import partialTailwindConfig from '../../tailwind.config';

export const enum SubmitStatus {
	SUCCESS,
	WARNING,
	FAILED,
}

export const tailwindConfig: any = resolveConfig(partialTailwindConfig as any);

export const HOST = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
export const VIEW_COUNT_REFRESH_RATE = 10 * 60; // Every 10 minutes
export const VIEW_COOLDOWN = 15 * 60 * 1000; // Every 15 minutes
