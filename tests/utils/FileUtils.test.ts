import FileUtils from '../../src/utils/FileUtils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { File } = require('buffer');
// eslint-disable-next-line @typescript-eslint/no-var-requires
global.crypto = require('crypto').webcrypto;

describe('FileUtils', () => {
  it('hashes valid file', async () => {
    const file = new File([Buffer.from('hello')], 'hello.txt', { type: 'text/plain' });
    const hash = await FileUtils.validateAndHash(file, ['text/plain'], 1024);
    expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('rejects invalid type', async () => {
    const file = new File([Buffer.from('hello')], 'hello.txt', { type: 'text/plain' });
    await expect(FileUtils.validateAndHash(file, ['image/png'], 1024)).rejects.toThrow('Invalid file type');
  });

  it('rejects large file', async () => {
    const file = new File([Buffer.alloc(2000)], 'big.txt', { type: 'text/plain' });
    await expect(FileUtils.validateAndHash(file, ['text/plain'], 1024)).rejects.toThrow('File too large');
  });
});
