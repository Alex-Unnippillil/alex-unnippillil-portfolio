/**
 * @jest-environment jsdom
 */

import Menu, { registerMenuAction, clearMenuActions } from '../../../src/components/contextMenu/Menu';

describe('ContextMenu', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    clearMenuActions();
  });

  test('opens on right click and executes action', () => {
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();

    const handler = jest.fn();
    registerMenuAction({ label: 'Action', handler });

    // eslint-disable-next-line no-new
    new Menu(opener);

    opener.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));

    const item = document.querySelector('li') as HTMLLIElement;
    expect(item).not.toBeNull();

    item.click();
    expect(handler).toHaveBeenCalled();
    expect(document.activeElement).toBe(opener);
  });

  test('opens on long press and executes action', () => {
    jest.useFakeTimers();
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();

    const handler = jest.fn();
    registerMenuAction({ label: 'Action', handler });
    // eslint-disable-next-line no-new
    new Menu(opener);

    opener.dispatchEvent(new Event('touchstart', { bubbles: true }));
    jest.advanceTimersByTime(600);

    const item = document.querySelector('li') as HTMLLIElement;
    expect(item).not.toBeNull();

    item.click();
    expect(handler).toHaveBeenCalled();
    expect(document.activeElement).toBe(opener);
    jest.useRealTimers();
  });

  test('opens on keyboard invocation and executes action', () => {
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();

    const handler = jest.fn();
    registerMenuAction({ label: 'Action', handler });
    // eslint-disable-next-line no-new
    new Menu(opener);

    opener.dispatchEvent(new KeyboardEvent('keydown', { key: 'ContextMenu', bubbles: true }));

    const item = document.querySelector('li') as HTMLLIElement;
    expect(item).not.toBeNull();

    item.click();
    expect(handler).toHaveBeenCalled();
    expect(document.activeElement).toBe(opener);
  });
});

