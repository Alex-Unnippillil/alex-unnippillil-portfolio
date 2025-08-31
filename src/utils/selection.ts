export default function selectRange<T>(items: T[], start: number, end: number): T[] {
  const [s, e] = start < end ? [start, end] : [end, start];
  const result: T[] = [];
  for (let i = s; i <= e && i < items.length; i += 1) {
    result.push(items[i]);
  }
  return result;
}
