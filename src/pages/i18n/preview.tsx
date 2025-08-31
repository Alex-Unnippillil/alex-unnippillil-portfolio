interface FlatMap { [key: string]: string; }

function flatten(obj: any, prefix = ''): FlatMap {
  const res: FlatMap = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      Object.assign(res, flatten(value, newKey));
    } else {
      res[newKey] = String(value);
    }
  });
  return res;
}

async function load(code: string): Promise<any> {
  const response = await fetch(`/locales/${code}.json`);
  return response.json();
}

export default async function render(): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const target = params.get('target') || 'es';

  const base = flatten(await load('en'));
  const locale = flatten(await load(target));

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  ['Key', 'Base', `Target (${target})`].forEach((text) => {
    const th = document.createElement('th');
    th.textContent = text;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  Object.keys(base).forEach((key) => {
    const row = document.createElement('tr');
    const k = document.createElement('td');
    k.textContent = key;
    row.appendChild(k);

    const b = document.createElement('td');
    b.textContent = base[key];
    row.appendChild(b);

    const t = document.createElement('td');
    if (!(key in locale)) {
      t.textContent = process.env.NODE_ENV !== 'production' ? '[missing]' : '';
      row.classList.add('missing');
    } else {
      t.textContent = locale[key];
    }
    row.appendChild(t);

    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  const root = document.getElementById('preview');
  if (root) {
    root.innerHTML = '';
    root.appendChild(table);
  }
}
