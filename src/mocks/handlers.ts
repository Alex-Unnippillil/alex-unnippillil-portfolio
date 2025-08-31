import { rest } from 'msw';
import { buildResponseSchema } from '../schema/build';

export const handlers = [
  rest.get('/api/sh/build', (req, res, ctx) => {
    const body = buildResponseSchema.parse({ status: 'ok' });
    return res(ctx.status(200), ctx.json(body));
  }),
];

export default handlers;
