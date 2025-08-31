(async () => {
  try {
    const res = await fetch('/api/logs');
    const data = await res.json();
    const tbody = document.querySelector('#log tbody')!;
    Object.keys(data).forEach((key) => {
      const row = document.createElement('tr');
      const item = data[key];
      row.innerHTML = '<td>' + key + '</td>' +
        '<td>' + (item.lastRun || '-') + '</td>' +
        '<td>' + (item.durationMs || '-') + '</td>' +
        '<td>' + (item.result || '-') + '</td>';
      tbody.appendChild(row);
    });
  } catch (e) {
    console.error(e);
  }
})();
