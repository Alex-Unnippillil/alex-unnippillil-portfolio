import fs from 'fs';
import path from 'path';

export interface RouteCapability {
  owner: string;
  reviewer: string;
}

export type RouteCapabilities = Record<string, RouteCapability>;

export function getPageRoutes(pagesDir: string): string[] {
  const routes: string[] = [];

  function walk(dir: string, base: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === 'config') {
          return;
        }
        const nextBase = `${base}/${entry.name}`;
        walk(fullPath, nextBase);
      } else if (entry.isFile() && /\.tsx?$/.test(entry.name)) {
        const name = entry.name.replace(/\.tsx?$/, '');
        const route = name === 'index' ? base || '/' : `${base}/${name}`;
        routes.push(route.replace(/\\/g, '/').replace(/\/+/g, '/'));
      }
    });
  }

  walk(pagesDir, '');
  return routes;
}

export function auditRoutes(capabilities: RouteCapabilities, routes: string[]): {
  missing: string[];
  unknown: string[];
  duplicates: string[];
} {
  const missing = routes.filter((r) => capabilities[r] === undefined);
  const unknown = Object.keys(capabilities).filter((r) => !routes.includes(r));
  const duplicates: string[] = [];
  const seen = new Set<string>();

  routes.forEach((r) => {
    if (seen.has(r)) {
      duplicates.push(r);
    } else {
      seen.add(r);
    }
  });

  return { missing, unknown, duplicates };
}

export function loadRouteCapabilities(filePath: string): RouteCapabilities {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as RouteCapabilities;
}
