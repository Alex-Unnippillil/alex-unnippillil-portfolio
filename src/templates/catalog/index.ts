import AppCatalog from '../../modules/apps/AppCatalog';
import Dock from '../../modules/apps/Dock';

const manifests = AppCatalog.load();
const dock = new Dock();

const searchInput = document.getElementById('search') as HTMLInputElement;
const categorySelect = document.getElementById('category') as HTMLSelectElement;
const list = document.getElementById('apps') as HTMLUListElement;

const categories = Array.from(new Set(manifests.map((m) => m.category)));

categories.forEach((cat) => {
  const option = document.createElement('option');
  option.value = cat;
  option.textContent = cat;
  categorySelect.appendChild(option);
});

function render(): void {
  const filtered = AppCatalog.filter(
    manifests,
    searchInput.value,
    categorySelect.value || undefined,
  );
  list.innerHTML = '';
  filtered.forEach((app) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    const installed = dock.getInstalled().includes(app.name);
    btn.textContent = installed ? 'Uninstall' : 'Install';
    btn.addEventListener('click', () => {
      if (installed) {
        dock.uninstall(app.name);
      } else {
        dock.install(app.name);
      }
      render();
    });
    li.textContent = `${app.name} `;
    li.appendChild(btn);
    list.appendChild(li);
  });
}

searchInput.addEventListener('input', render);
categorySelect.addEventListener('change', render);
render();
