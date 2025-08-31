const en = require('../locales/en.json') as Record<string, string>;

const messages: Record<string, Record<string, string>> = { en };

export default function useI18n(locale: string) {
  const lang = locale.split('_')[0];
  const dict = messages[lang] || messages.en;
  return {
    t: (key: string): string => dict[key] || key,
    locale: lang,
  };
}
