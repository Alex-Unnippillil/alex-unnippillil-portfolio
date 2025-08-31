import { generateAccessiblePair, AccessiblePair } from '../tools/paletteGenerator';

export interface ThemeTokenMap {
  light: AccessiblePair;
  dark: AccessiblePair;
}

export const tokens: ThemeTokenMap = {
  light: generateAccessiblePair('#ffffff'),
  dark: generateAccessiblePair('#121212'),
};

export default tokens;
