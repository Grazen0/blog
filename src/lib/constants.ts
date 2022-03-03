import resolveConfig from 'tailwindcss/resolveConfig';
import partialTailwindConfig from '../../tailwind.config';

export const tailwindConfig: any = resolveConfig(partialTailwindConfig as any);

export const HOST = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
