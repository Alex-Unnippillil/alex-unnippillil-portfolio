/* eslint-disable @typescript-eslint/no-explicit-any */
// React is assumed to be available in the execution environment
// but we declare it here to avoid bundling errors during tests.
declare const React: any;

type CsvImportWizardProps = {
  requiredColumns?: string[];
  onComplete?: (rows: Record<string, string>[]) => void;
};

const parseCsv = (text: string): { columns: string[]; rows: string[][] } => {
  const lines = text.trim().split(/\r?\n/).map((l) => l.split(',').map((c) => c.trim()));
  const columns = lines.shift() || [];
  return { columns, rows: lines };
};

const CsvImportWizard = ({ requiredColumns = [], onComplete }: CsvImportWizardProps): any => {
  const [columns, setColumns] = React.useState<string[]>([]);
  const [rows, setRows] = React.useState<string[][]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const { columns: cols, rows: csvRows } = parseCsv(String(reader.result));
      setColumns(cols);
      setRows(csvRows.slice(0, 5)); // preview first 5 rows

      const missing = requiredColumns.filter((c) => !cols.includes(c));
      setErrors(missing.map((m) => `Missing column: ${m}`));

      if (missing.length === 0 && onComplete) {
        const mapped = csvRows.map((row) => {
          const obj: Record<string, string> = {};
          cols.forEach((col, idx) => {
            obj[col] = row[idx];
          });
          return obj;
        });
        onComplete(mapped);
      }
    };
    reader.readAsText(file);
  };

  const handleChange = (e: any) => {
    const file: File | undefined = e.target.files && e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  return React.createElement(
    'div',
    null,
    React.createElement('input', { type: 'file', accept: '.csv', onChange: handleChange }),
    errors.length > 0 &&
      React.createElement(
        'ul',
        { className: 'errors' },
        errors.map((err: string) => React.createElement('li', { key: err }, err))
      ),
    columns.length > 0 &&
      React.createElement(
        'table',
        null,
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            columns.map((c: string) => React.createElement('th', { key: c }, c))
          )
        ),
        React.createElement(
          'tbody',
          null,
          rows.map((r: string[], i: number) =>
            React.createElement(
              'tr',
              { key: i },
              r.map((cell: string, j: number) => React.createElement('td', { key: j }, cell))
            )
          )
        )
      )
  );
};

export default CsvImportWizard;
