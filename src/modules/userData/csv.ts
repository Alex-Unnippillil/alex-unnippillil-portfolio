export function stringify(rows: any[][]): string {
  return rows
    .map((row) => row.map((value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(','))
    .join('\n');
}
