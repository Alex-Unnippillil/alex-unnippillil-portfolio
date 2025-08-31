import fs from 'fs';
import os from 'os';
import path from 'path';
import DemoDataGenerator from '../../src/demo/DemoDataGenerator';

describe('DemoDataGenerator', () => {
  it('seeds and wipes demo data', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'demo-test-'));
    const generator = new DemoDataGenerator(tmpDir);

    generator.seed();
    const profile = path.join(tmpDir, 'github-profile.json');
    const repos = path.join(tmpDir, 'github-repositories.json');

    expect(fs.existsSync(profile)).toBe(true);
    expect(fs.existsSync(repos)).toBe(true);

    generator.wipe();
    expect(fs.existsSync(profile)).toBe(false);
    expect(fs.existsSync(repos)).toBe(false);
  });
});
