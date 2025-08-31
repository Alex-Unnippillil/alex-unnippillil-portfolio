import { z } from 'zod';

const serverSchema = z.object({
  GITHUB_TOKEN: z.string().min(1, 'GITHUB_TOKEN is required'),
});

const clientSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
  PUBLIC_URL: z.string().url().optional(),
});

const envSchema = serverSchema.merge(clientSchema);

const _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error('Invalid environment variables', _env.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

const envData = _env.data;

export const env = {
  NODE_ENV: envData.NODE_ENV ?? 'development',
  PUBLIC_URL: envData.PUBLIC_URL ?? 'http://localhost:3000',
  GITHUB_TOKEN: envData.GITHUB_TOKEN,
};

export const envMap = {
  server: { GITHUB_TOKEN: env.GITHUB_TOKEN },
  client: { NODE_ENV: env.NODE_ENV, PUBLIC_URL: env.PUBLIC_URL },
};
