let version = 0;
const form = document.getElementById('configForm') as HTMLFormElement;
const mergeDiv = document.getElementById('merge') as HTMLElement;

function getFormData() {
  const template = (form.elements.namedItem('template') as HTMLInputElement).value;
  const base = (form.elements.namedItem('base') as HTMLInputElement).value;
  return { template, base };
}

async function autosave() {
  const data = getFormData();
  const response = await fetch('/api/form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, version }),
  });
  if (response.ok) {
    const json = await response.json();
    version = json.version;
  }
}

function showMerge(diff: any, serverVersion: number, serverData: any) {
  mergeDiv.innerHTML = '';
  Object.keys(diff).forEach((key) => {
    const wrapper = document.createElement('div');
    const message = document.createElement('div');
    message.innerHTML = `<strong>${key}</strong>: server="${diff[key].current ?? ''}" local="${diff[key].incoming ?? ''}"`;
    const accept = document.createElement('button');
    accept.textContent = 'Accept Server';
    accept.onclick = () => {
      const input = form.elements.namedItem(key) as HTMLInputElement;
      if (input) input.value = serverData[key] ?? '';
      version = serverVersion;
      mergeDiv.innerHTML = '';
    };
    const overwrite = document.createElement('button');
    overwrite.textContent = 'Overwrite';
    overwrite.onclick = () => {
      version = serverVersion;
      autosave();
      mergeDiv.innerHTML = '';
    };
    wrapper.appendChild(message);
    wrapper.appendChild(accept);
    wrapper.appendChild(overwrite);
    mergeDiv.appendChild(wrapper);
  });
}

form.addEventListener('input', () => {
  autosave();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = getFormData();
  const response = await fetch('/api/form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'If-Match': String(version),
    },
    body: JSON.stringify({ data }),
  });

  if (response.status === 409) {
    const json = await response.json();
    showMerge(json.diff, json.version, json.current);
  } else if (response.ok) {
    const json = await response.json();
    version = json.version;
  }
});
