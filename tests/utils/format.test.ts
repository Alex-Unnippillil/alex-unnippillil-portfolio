import { formatDate, formatNumber } from '../../src/utils/format';

describe('format utilities', () => {
  it('formats dates using Intl', () => {
    const date = new Date('2020-01-02T00:00:00Z');
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      day: '2-digit',
      month: '2-digit',
      timeZone: 'UTC',
    };
    expect(formatDate(date, 'en', options)).toBe(new Intl.DateTimeFormat('en', options).format(date));
  });

  it('formats numbers for RTL locales', () => {
    const number = 1234.56;
    expect(formatNumber(number, 'ar')).toBe(new Intl.NumberFormat('ar').format(number));
  });
});
