import UserDataExporter from '../../src/modules/userData/Exporter';
import UserDataImporter from '../../src/modules/userData/Importer';

describe('User data import/export', () => {
  const sample = { login: 'demo', first_name: 'Demo' };

  it('exports JSON with version', () => {
    const exporter = new UserDataExporter();
    const output = exporter.export(sample, 'json', 'v1');
    const parsed = JSON.parse(output);
    expect(parsed.version).toBe('v1');
    expect(parsed.data).toEqual(sample);
  });

  it('exports CSV with version', () => {
    const exporter = new UserDataExporter();
    const output = exporter.export(sample, 'csv', 'v1');
    expect(output.split('\n')[0]).toBe('schemaVersion,login,first_name');
    expect(output.split('\n')[1]).toBe('v1,demo,Demo');
  });

  it('validates and previews imports', () => {
    const importer = new UserDataImporter();
    const payload = { version: 'v1', data: { login: 'demo', first_name: 'New' } };
    expect(importer.validate(payload, 'v1')).toBe(true);
    const preview = importer.preview(sample, payload.data);
    expect(preview.updated.first_name).toEqual({ from: 'Demo', to: 'New' });
  });

  it('emits progress during processing', async () => {
    const importer = new UserDataImporter();
    const payload = { login: 'demo', first_name: 'New', last_name: 'User' };
    const progresses: number[] = [];
    importer.on('progress', (p) => progresses.push(p));
    const result = await importer.process({}, payload);
    expect(result).toEqual(payload);
    expect(progresses[progresses.length - 1]).toBe(100);
  });
});
