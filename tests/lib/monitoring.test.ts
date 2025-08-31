import { beforeSend, initMonitoring } from '../../src/lib/monitoring';

jest.mock('@sentry/node', () => ({ init: jest.fn() }), { virtual: true });
jest.mock('@sentry/browser', () => ({ init: jest.fn() }), { virtual: true });

describe('monitoring', () => {
  it('scrubs sensitive data', () => {
    const event = {
      message: 'Email test@example.com token=abc123 /home/user/file.txt',
      request: {
        headers: { Authorization: 'Bearer secret' },
        url: '/api?token=def456',
      },
    };

    const scrubbed = beforeSend(event);
    const serialized = JSON.stringify(scrubbed);
    expect(serialized).not.toMatch(/test@example.com/);
    expect(serialized).not.toMatch(/abc123/);
    expect(serialized).not.toMatch(/def456/);
    expect(serialized).not.toMatch(/home\/user/);
  });

  it('initializes with release and environment', () => {
    process.env.SENTRY_DSN = 'dsn';
    process.env.NODE_ENV = 'production';
    process.env.GITHUB_SHA = 'sha123';

    initMonitoring();
    const sentry = require('@sentry/node');
    expect(sentry.init).toHaveBeenCalledWith(expect.objectContaining({
      dsn: 'dsn',
      environment: 'production',
      release: 'sha123',
    }));
  });
});
