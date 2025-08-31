import DiffManager, { ChangeAnnotation } from '../../src/modules/diff/DiffManager';

describe('DiffManager', () => {
  it('creates unified and split diffs for Markdown', () => {
    const manager = new DiffManager();
    const oldContent = '# Title\n\nParagraph';
    const newContent = '# Title\n\nNew paragraph';
    const annotation: ChangeAnnotation = {
      author: 'Alice',
      time: new Date('2023-01-01T00:00:00Z'),
      reason: 'Update paragraph',
    };

    const result = manager.generateDiff('doc.md', oldContent, newContent, annotation);

    expect(result.unified).toContain('-Paragraph');
    expect(result.unified).toContain('+New paragraph');

    const removed = result.split.some((l) => l.left === 'Paragraph' && l.right === '');
    const added = result.split.some((l) => l.left === '' && l.right === 'New paragraph');

    expect(removed).toBe(true);
    expect(added).toBe(true);

    expect(manager.getHistory()[0].annotation.author).toBe('Alice');
  });

  it('previews revert for JSON changes', () => {
    const manager = new DiffManager();
    const oldJson = '{\n  "a": 1\n}\n';
    const newJson = '{\n  "a": 2\n}\n';
    manager.generateDiff('data.json', oldJson, newJson, {
      author: 'Bob',
      time: new Date('2023-01-02T00:00:00Z'),
      reason: 'Change value',
    });

    const preview = manager.previewRevert(0);

    expect(preview.unified).toContain('-  "a": 2');
    expect(preview.unified).toContain('+  "a": 1');
  });
});
