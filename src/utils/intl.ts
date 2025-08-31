import { di } from '../di';
import { TYPES } from '../types';

export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions, locale?: string): string {
  const { config } = di.get(TYPES.Application);
  const lang = locale || config.global.locale;
  return new Intl.DateTimeFormat(lang, options).format(date);
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions, locale?: string): string {
  const { config } = di.get(TYPES.Application);
  const lang = locale || config.global.locale;
  return new Intl.NumberFormat(lang, options).format(value);
}
