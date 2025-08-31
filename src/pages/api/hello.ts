import { withLogging } from './logger';

const handler = withLogging(async (_req, res) => {
  const data = { message: 'hello world' };
  const body = JSON.stringify(data);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(body);
});

export default handler;
