import { tokens } from '../../src/theme/tokens';
import { contrast } from '../../src/tools/paletteGenerator';

describe('dark mode theme', () => {
  test('renders dark tokens', () => {
    expect(tokens.dark).toMatchSnapshot();
  });

  test('dark background and text have AA contrast', () => {
    const ratio = contrast(tokens.dark.background, tokens.dark.foreground);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
