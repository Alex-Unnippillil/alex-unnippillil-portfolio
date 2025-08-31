/** @jest-environment jsdom */
import createSandboxedIframe from '../../src/utils/SandboxedIframe';

describe('createSandboxedIframe', () => {
  it('creates iframe with sandbox attribute', () => {
    const container = document.createElement('div');
    const handle = createSandboxedIframe(container, {
      src: 'https://example.com',
      allowedOrigin: 'https://example.com',
    });
    expect(handle.iframe.getAttribute('sandbox')).toBe('allow-scripts');
    handle.destroy();
  });

  it('blocks disallowed capability and shows warning', () => {
    const container = document.createElement('div');
    const warn = jest.fn();
    const handle = createSandboxedIframe(container, {
      src: 'https://example.com',
      allowedOrigin: 'https://example.com',
      allowedCapabilities: ['ping'],
      onWarning: warn,
    });

    const event = new MessageEvent('message', {
      origin: 'https://example.com',
      source: handle.iframe.contentWindow,
      data: { type: 'request', capability: 'blocked' },
    });
    window.dispatchEvent(event);

    expect(container.querySelector('.iframe-warning')).not.toBeNull();
    expect(warn).toHaveBeenCalled();
    handle.destroy();
  });

  it('ignores messages from other origins', () => {
    const container = document.createElement('div');
    const warn = jest.fn();
    const handle = createSandboxedIframe(container, {
      src: 'https://example.com',
      allowedOrigin: 'https://example.com',
      onWarning: warn,
    });

    const event = new MessageEvent('message', {
      origin: 'https://evil.com',
      source: handle.iframe.contentWindow,
      data: { type: 'request', capability: 'blocked' },
    });
    window.dispatchEvent(event);

    expect(container.querySelector('.iframe-warning')).toBeNull();
    expect(warn).not.toHaveBeenCalled();
    handle.destroy();
  });
});
