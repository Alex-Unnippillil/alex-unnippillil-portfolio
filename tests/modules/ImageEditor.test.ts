import ImageEditor from '../../src/modules/image/ImageEditor';

describe('ImageEditor', () => {
  it('crop, annotate, export', () => {
    const editor = new ImageEditor(1000, 800);
    const rect = editor.crop(0, 0, 800, 600, 'fourThree');
    expect(Math.round((rect.width / rect.height) * 100) / 100).toBeCloseTo(4 / 3, 2);
    editor.rotate(90);
    editor.addAnnotation({
      type: 'arrow',
      start: { x: 10, y: 10 },
      end: { x: 100, y: 100 },
    });
    editor.addAnnotation({
      type: 'text',
      position: { x: 50, y: 50 },
      text: 'Hello',
    });
    const result = editor.export({ maxWidth: 500, maxHeight: 500, format: 'image/jpeg' });
    expect(result).toStrictEqual({
      width: 375,
      height: 500,
      format: 'image/jpeg',
      annotations: [
        { type: 'arrow', start: { x: 10, y: 10 }, end: { x: 100, y: 100 } },
        { type: 'text', position: { x: 50, y: 50 }, text: 'Hello' },
      ],
    });
  });
});
