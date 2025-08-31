import notes from '@root/data/releases/latest.md';

function getCookie(name: string): string | undefined {
  return document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))?.split('=')[1];
}

function setCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function parseSections(md: string): { title: string; items: string[] }[] {
  const lines = md.trim().split('\n');
  const sections: { title: string; items: string[] }[] = [];
  let current: { title: string; items: string[] } | null = null;

  lines.forEach((line) => {
    if (line.startsWith('## ')) {
      current = { title: line.substring(3).trim(), items: [] };
      sections.push(current);
    } else if (line.startsWith('- ')) {
      const item = line.substring(2).trim().replace(/\[#(\d+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">#$1</a>');
      current?.items.push(item);
    }
  });

  return sections;
}

export default function showWhatsNew(): void {
  const lines = notes.trim().split('\n');
  const versionLine = lines.shift();
  if (!versionLine) return;
  const version = versionLine.replace(/^#\s*/, '').trim();

  if (getCookie('whats-new') === version) return;

  const sections = parseSections(lines.join('\n'));
  const container = document.createElement('div');
  container.className = 'whats-new';
  const header = document.createElement('div');
  header.className = 'whats-new__header';
  header.innerHTML = `<strong>What's new in ${version}</strong>`;
  const close = document.createElement('button');
  close.className = 'whats-new__close';
  close.innerHTML = '&times;';
  close.addEventListener('click', () => {
    setCookie('whats-new', version, 365);
    container.remove();
  });
  header.appendChild(close);
  container.appendChild(header);

  sections.forEach((section) => {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'whats-new__section';
    const title = document.createElement('h3');
    title.textContent = section.title;
    sectionEl.appendChild(title);
    const list = document.createElement('ul');
    section.items.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = item;
      list.appendChild(li);
    });
    sectionEl.appendChild(list);
    container.appendChild(sectionEl);
  });

  document.body.appendChild(container);
}
