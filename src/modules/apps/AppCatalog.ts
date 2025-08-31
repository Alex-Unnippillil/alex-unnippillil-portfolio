import fs from 'fs';
import path from 'path';
import AppManifest from '../../interfaces/AppManifest';

export default class AppCatalog {
  static load(appsDir: string = path.join(process.cwd(), 'apps')): AppManifest[] {
    if (!fs.existsSync(appsDir)) {
      return [];
    }
    return fs.readdirSync(appsDir)
      .map((app) => {
        const manifestPath = path.join(appsDir, app, 'manifest.json');
        if (!fs.existsSync(manifestPath)) {
          throw new Error(`Missing manifest for app: ${app}`);
        }
        const data = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as AppManifest;
        if (!data.name || !data.icon || !data.category || !Array.isArray(data.permissions)) {
          throw new Error(`Invalid manifest for app: ${app}`);
        }
        return data;
      });
  }

  static filter(apps: AppManifest[], query: string, category?: string): AppManifest[] {
    return apps.filter((app) => {
      const matchesQuery = app.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category ? app.category === category : true;
      return matchesQuery && matchesCategory;
    });
  }
}
