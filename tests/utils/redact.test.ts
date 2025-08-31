import redact from '../../src/utils/redact';

describe('redact', () => {
  it('removes sensitive fields', () => {
    const data = { a: 1, secret: 'shh' };
    const cleaned = redact(data, ['secret']);
    expect(cleaned).toStrictEqual({ a: 1, secret: undefined });
    expect(data.secret).toBe('shh');
  });
});
