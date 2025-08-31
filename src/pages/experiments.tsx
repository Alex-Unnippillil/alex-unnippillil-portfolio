import { getExperimentResults, ExperimentResult } from '../utils/flags';

function toCSV(data: ExperimentResult[]): string {
  const header = 'name,variant,timestamp';
  const rows = data.map((r) => `${r.name},${r.variant},${r.timestamp}`);
  return [header, ...rows].join('\n');
}

function render(): void {
  const root = document.getElementById('experiments') || document.body;
  const data = getExperimentResults();

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Experiment</th><th>Variant</th><th>Timestamp</th></tr>';
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  data.forEach((r) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.name}</td><td>${r.variant}</td><td>${r.timestamp}</td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  root.appendChild(table);

  const button = document.createElement('button');
  button.textContent = 'Export CSV';
  button.addEventListener('click', () => {
    const csv = toCSV(data);
    const link = document.createElement('a');
    link.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
    link.setAttribute('download', 'experiments.csv');
    link.click();
  });
  root.appendChild(button);
}

document.addEventListener('DOMContentLoaded', render);
