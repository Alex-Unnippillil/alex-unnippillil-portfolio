import path from 'path';
import { auditRoutes, getPageRoutes, loadRouteCapabilities } from '../src/utils/routeAudit';

const capabilitiesPath = path.resolve(__dirname, '../data/route-capabilities.json');
const pagesDir = path.resolve(__dirname, '../src/pages');

const capabilities = loadRouteCapabilities(capabilitiesPath);
const routes = getPageRoutes(pagesDir);
const { missing } = auditRoutes(capabilities, routes);

if (missing.length > 0) {
  // eslint-disable-next-line no-console
  console.error('Missing route capabilities for:\n', missing.join('\n'));
  process.exit(1);
}
