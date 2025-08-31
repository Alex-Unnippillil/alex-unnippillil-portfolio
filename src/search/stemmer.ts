export default function stem(word: string): string {
  let result = word.toLowerCase();
  if (result.endsWith('ies')) {
    result = `${result.slice(0, -3)}y`;
  } else if (result.endsWith('ing')) {
    result = result.slice(0, -3);
  } else if (result.endsWith('ed')) {
    result = result.slice(0, -2);
  } else if (result.endsWith('es')) {
    result = result.slice(0, -2);
  } else if (result.endsWith('s') && result.length > 1) {
    result = result.slice(0, -1);
  }
  return result;
}
