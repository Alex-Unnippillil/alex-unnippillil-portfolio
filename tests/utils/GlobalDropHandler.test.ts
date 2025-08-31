/** @jest-environment jsdom */
import GlobalDropHandler from '../../src/utils/GlobalDropHandler';

describe('GlobalDropHandler', () => {
  let imageFlow: jest.Mock;
  let textFlow: jest.Mock;
  let invalid: jest.Mock;
  let handler: GlobalDropHandler;

  beforeEach(() => {
    document.body.innerHTML = '<div id="target" data-drop-target></div>';
    imageFlow = jest.fn();
    textFlow = jest.fn();
    invalid = jest.fn();
    handler = new GlobalDropHandler({
      flows: { 'image/': imageFlow, 'text/': textFlow },
      invalid,
    });
  });

  afterEach(() => {
    handler.destroy();
  });

  it('highlights drop targets on dragover', () => {
    const ev = new Event('dragover', { bubbles: true, cancelable: true });
    document.dispatchEvent(ev);
    expect(document.getElementById('target')?.classList.contains('drop-target--active')).toBe(true);
  });

  it('routes image file to image flow', () => {
    const dt = { files: [new File(['a'], 'a.png', { type: 'image/png' })] } as unknown as DataTransfer;
    const ev = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(ev, 'dataTransfer', { value: dt });
    document.dispatchEvent(ev);
    expect(imageFlow).toHaveBeenCalledTimes(1);
    expect(invalid).not.toHaveBeenCalled();
  });

  it('routes text file to text flow', () => {
    const dt = { files: [new File(['txt'], 'a.txt', { type: 'text/plain' })] } as unknown as DataTransfer;
    const ev = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(ev, 'dataTransfer', { value: dt });
    document.dispatchEvent(ev);
    expect(textFlow).toHaveBeenCalledTimes(1);
    expect(invalid).not.toHaveBeenCalled();
  });

  it('rejects unsupported file types', () => {
    const dt = { files: [new File(['bin'], 'a.bin', { type: 'application/octet-stream' })] } as unknown as DataTransfer;
    const ev = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(ev, 'dataTransfer', { value: dt });
    document.dispatchEvent(ev);
    expect(invalid).toHaveBeenCalled();
    expect(invalid.mock.calls[0][1]).toContain('Unsupported file type');
  });
});

