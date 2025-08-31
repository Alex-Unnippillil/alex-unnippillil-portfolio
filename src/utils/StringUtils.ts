export default class StringUtils {
  static ltrim(str: string, symbol: string): string {
    return str[0] === symbol
      ? str.substring(1)
      : str;
  }

  static rtrim(str: string, symbol: string): string {
    return str[str.length - 1] === symbol
      ? str.substring(0, str.length - 1)
      : str;
  }

  static softHyphenate(str: string, size = 10): string {
    const reg = new RegExp(`(\\S{${size}})(?=\\S)`, 'g');
    return str.replace(reg, '$1\u00AD');
  }
}
