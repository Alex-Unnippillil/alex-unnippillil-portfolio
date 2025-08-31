export default class ChangelogViewer {
  private url = '/data/changelog.md';

  private storageKey = 'changelog-last';

  public async init(): Promise<void> {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        return;
      }
      const text = await response.text();
      const last = localStorage.getItem(this.storageKey);
      if (last === text) {
        return;
      }
      this.render(text);
      localStorage.setItem(this.storageKey, text);
    } catch {
      // ignore
    }
  }

  private render(markdown: string): void {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.background = 'rgba(0, 0, 0, 0.5)';
    overlay.style.overflow = 'auto';
    overlay.style.zIndex = '10000';

    const box = document.createElement('div');
    box.style.background = '#fff';
    box.style.margin = '5% auto';
    box.style.padding = '20px';
    box.style.maxWidth = '600px';

    const close = document.createElement('button');
    close.textContent = 'Close';
    close.addEventListener('click', () => overlay.remove());

    box.innerHTML = this.parseMarkdown(markdown);
    box.appendChild(close);
    overlay.appendChild(box);

    document.body.appendChild(overlay);
  }

  private parseMarkdown(md: string): string {
    const lines = md.split('\n');
    let html = '';
    let inList = false;
    lines.forEach((line) => {
      if (line.startsWith('## ')) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<h2>${line.substring(3)}</h2>`;
      } else if (line.startsWith('- ')) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        html += `<li>${line.substring(2)}</li>`;
      } else if (line.trim() === '') {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
      } else {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<p>${line}</p>`;
      }
    });
    if (inList) {
      html += '</ul>';
    }
    return html;
  }
}
