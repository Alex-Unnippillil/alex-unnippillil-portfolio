export default function clampAndRound(value: number, min?: number, max?: number): number {
  let result = Math.round(value);
  if (typeof min === 'number') {
    result = Math.max(result, min);
  }
  if (typeof max === 'number') {
    result = Math.min(result, max);
  }
  return result;
}
