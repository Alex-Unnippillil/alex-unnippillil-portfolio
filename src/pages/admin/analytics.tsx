import AnalyticsTracker from '../../lib/analytics';

function createTable(title: string, data: Record<string, number>): HTMLElement {
  const wrapper = document.createElement('div');
  const heading = document.createElement('h2');
  heading.textContent = title;
  wrapper.appendChild(heading);

  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  Object.keys(data).forEach((key) => {
    const tr = document.createElement('tr');
    const tdKey = document.createElement('td');
    tdKey.textContent = key;
    const tdVal = document.createElement('td');
    tdVal.textContent = data[key].toString();
    tr.appendChild(tdKey);
    tr.appendChild(tdVal);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  wrapper.appendChild(table);
  return wrapper;
}

document.addEventListener('DOMContentLoaded', () => {
  const tracker = new AnalyticsTracker();
  const summary = tracker.summary();

  const root = document.getElementById('analytics');
  if (!root) {
    return;
  }
  root.appendChild(createTable('Page Views', summary.pages));
  root.appendChild(createTable('Actions', summary.actions));
});
