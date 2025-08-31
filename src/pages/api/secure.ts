import { withPolicy } from '../../utils/policy';

function handler(req: any, res: any): void {
  res.json({ secret: true });
}

export default withPolicy('read', () => ({ type: 'secret' }))(handler);
