import { ERROR_DICTIONARY } from '../../src/errors/dictionary';
import { validatePlaceholders } from '../../src/i18n/errors/validatePlaceholders';

const en = require('../../src/i18n/errors/en.json');

describe('error locale placeholders', () => {
  it('should match dictionary placeholders', () => {
    expect(() => validatePlaceholders(ERROR_DICTIONARY, en)).not.toThrow();
  });
});
