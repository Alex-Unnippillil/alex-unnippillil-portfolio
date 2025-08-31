import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { registerBuildRoute } from './build';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

registerBuildRoute(registry);

export default registry;
