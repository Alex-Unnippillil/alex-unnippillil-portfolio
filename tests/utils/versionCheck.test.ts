import VersionCheck, { VersionInfo } from '../../src/utils/versionCheck';

describe('VersionCheck', () => {
  it('identifies up-to-date versions', () => {
    const server: VersionInfo = { api: '1', schema: '1' };
    const client: VersionInfo = { api: '1', schema: '1' };
    expect(VersionCheck.isOutdated(server, client)).toBe(false);
  });

  it('identifies outdated versions', () => {
    const server: VersionInfo = { api: '2', schema: '1' };
    const client: VersionInfo = { api: '1', schema: '1' };
    expect(VersionCheck.isOutdated(server, client)).toBe(true);
  });
});
