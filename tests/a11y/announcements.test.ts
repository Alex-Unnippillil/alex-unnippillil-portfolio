import { JSDOM } from 'jsdom';
import { announce } from '../../src/utils/announce';

describe('announcement utilities', () => {
  let dom: any;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body>'
      + '<div id="live-region-polite"></div>'
      + '<div id="live-region-assertive"></div>'
      + '</body></html>');
    // @ts-ignore
    global.document = dom.window.document;
  });

  it('announces politely', () => {
    announce('Hello');
    const region = dom.window.document.getElementById('live-region-polite');
    expect(region?.textContent).toBe('Hello');
  });

  it('announces assertively', () => {
    announce('Warning', 'assertive');
    const region = dom.window.document.getElementById('live-region-assertive');
    expect(region?.textContent).toBe('Warning');
  });

  it('avoids repeated messages', () => {
    announce('Repeat');
    announce('Repeat');
    const region = dom.window.document.getElementById('live-region-polite');
    expect(region?.textContent).toBe('Repeat\u00A0');
  });
});
