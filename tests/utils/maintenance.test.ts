/** @jest-environment jsdom */
import { renderIncidentBanner, confirmProductionToggle } from '../../src/utils/maintenance';

describe('maintenance utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('renderIncidentBanner adds banner with info', () => {
    const doc = window.document;
    const banner = renderIncidentBanner(doc, 'msg', 'http://example.com', 'build', 'commit');
    expect(doc.body.firstChild).toBe(banner);
    expect(banner.textContent).toContain('msg');
    expect(banner.textContent).toContain('build');
    expect(banner.textContent).toContain('commit');
    const link = banner.querySelector('a') as HTMLAnchorElement;
    expect(link.href).toBe('http://example.com/');
  });

  test('confirmProductionToggle requires confirmation in production', () => {
    const confirm = jest.fn().mockReturnValue(true);
    expect(confirmProductionToggle(true, confirm)).toBe(true);
    expect(confirm).toHaveBeenCalled();
  });

  test('confirmProductionToggle bypasses confirmation in development', () => {
    const confirm = jest.fn();
    expect(confirmProductionToggle(false, confirm)).toBe(true);
    expect(confirm).not.toHaveBeenCalled();
  });
});
