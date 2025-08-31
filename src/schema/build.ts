import { z } from 'zod';
import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const buildResponseSchema = z.object({
  status: z.string().openapi({ example: 'ok' }),
});

export const registerBuildRoute = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/api/sh/build',
    responses: {
      200: {
        description: 'Build status',
        content: {
          'application/json': {
            schema: buildResponseSchema,
          },
        },
      },
    },
  });
};
