import fs from 'fs';
import path from 'path';
import AppCatalog from '../../src/modules/apps/AppCatalog';

describe('AppCatalog', () => {
  it('loads manifests', () => {
    const tmp = fs.mkdtempSync(path.join(process.cwd(), 'tmp-apps-'));
    fs.mkdirSync(path.join(tmp, 'app1'));
    fs.writeFileSync(path.join(tmp, 'app1', 'manifest.json'), JSON.stringify({
      name: 'App1',
      icon: 'icon.png',
      category: 'test',
      permissions: ['storage'],
    }));
    const manifests = AppCatalog.load(tmp);
    expect(manifests).toHaveLength(1);
    expect(manifests[0].name).toBe('App1');
  });

  it('throws if manifest missing', () => {
    const tmp = fs.mkdtempSync(path.join(process.cwd(), 'tmp-apps-'));
    fs.mkdirSync(path.join(tmp, 'app1'));
    expect(() => AppCatalog.load(tmp)).toThrow('Missing manifest');
  });
});
