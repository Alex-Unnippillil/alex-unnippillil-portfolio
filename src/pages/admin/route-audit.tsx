import path from 'path';
import { auditRoutes, getPageRoutes, loadRouteCapabilities } from '../../utils/routeAudit';

const capabilities = loadRouteCapabilities(path.resolve(__dirname, '../../../data/route-capabilities.json'));
const routes = getPageRoutes(path.resolve(__dirname, '..'));

const results = auditRoutes(capabilities, routes);

function render(): void {
  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify(results, null, 2);
  document.body.appendChild(pre);
}

if (typeof document !== 'undefined') {
  render();
}

export default results;
