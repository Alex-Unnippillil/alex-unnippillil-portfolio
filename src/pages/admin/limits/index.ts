(() => {
  fetch('/api/admin/limits')
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector('#limits tbody');
      if (!tbody) return;
      data.events.forEach((e: { ip: string; session: string; path: string; at: number; }) => {
        const tr = document.createElement('tr');
        const time = new Date(e.at).toLocaleString();
        tr.innerHTML = `<td>${e.ip}</td><td>${e.session}</td><td>${e.path}</td><td>${time}</td>`;
        tbody.appendChild(tr);
      });
    })
    .catch(() => {
      const tbody = document.querySelector('#limits tbody');
      if (!tbody) return;
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="4">Failed to load data</td>';
      tbody.appendChild(tr);
    });
})();
