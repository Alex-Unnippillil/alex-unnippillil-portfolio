import HeadManager from '../../src/modules/head/HeadManager';

describe('HeadManager', () => {
  it('emits canonical, meta and open graph tags without duplicates', () => {
    const manager = new HeadManager();

    manager.canonical('https://example.com');
    manager.canonical('https://override.com');

    manager.title('First Title');
    manager.title('Final Title');

    manager.metaName('description', 'desc1');
    manager.metaName('description', 'desc2');

    manager.metaProperty('og:title', 'OG1');
    manager.metaProperty('og:title', 'OG2');

    const out = manager.render();

    expect(out.match(/<link rel="canonical"/g)?.length).toBe(1);
    expect(out.match(/<title>/g)?.length).toBe(1);
    expect(out.match(/<meta name="description"/g)?.length).toBe(1);
    expect(out.match(/<meta property="og:title"/g)?.length).toBe(1);

    expect(out).toContain('https://override.com');
    expect(out).toContain('Final Title');
    expect(out).toContain('desc2');
    expect(out).toContain('OG2');
  });
});
