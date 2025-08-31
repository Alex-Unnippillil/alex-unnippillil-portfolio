/**
 * @jest-environment jsdom
 */
import ContextMenu from '../../src/components/ContextMenu';
import { register } from '../../src/utils/contextMenuRegistry';

describe('ContextMenu', () => {
  it('returns focus to opener when closed', () => {
    jest.useFakeTimers();

    const action = { label: 'item', onSelect: () => {} };
    register('test', action);

    const button = document.createElement('button');
    document.body.appendChild(button);

    const menu = new ContextMenu();
    menu.attach(button, 'test');

    button.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 0, clientY: 0 }));

    jest.runAllTimers();

    expect(document.activeElement).not.toBe(button);

    menu.close();

    expect(document.activeElement).toBe(button);

    jest.useRealTimers();
  });
});
