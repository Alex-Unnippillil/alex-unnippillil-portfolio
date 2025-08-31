import { ERROR_DICTIONARY } from '../../errors/dictionary';

const PLACEHOLDER_REGEXP = /{{(.*?)}}/g;

function extract(str: string): Set<string> {
  const result = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = PLACEHOLDER_REGEXP.exec(str)) !== null) {
    result.add(match[1]);
  }
  return result;
}

export function validatePlaceholders(
  dictionary: typeof ERROR_DICTIONARY,
  locale: Record<string, string>,
): void {
  Object.keys(dictionary).forEach((key) => {
    const dictPlaceholders = extract(dictionary[key].long);
    const localeMessage = locale[key];
    if (!localeMessage) {
      throw new Error(`Missing translation for key ${key}`);
    }
    const localePlaceholders = extract(localeMessage);
    dictPlaceholders.forEach((ph) => {
      if (!localePlaceholders.has(ph)) {
        throw new Error(`Missing placeholder ${ph} in translation for key ${key}`);
      }
    });
    localePlaceholders.forEach((ph) => {
      if (!dictPlaceholders.has(ph)) {
        throw new Error(`Unknown placeholder ${ph} in translation for key ${key}`);
      }
    });
  });
}
