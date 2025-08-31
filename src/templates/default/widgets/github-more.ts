interface Repository {
  html_url: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

function generateRepositoriesHtml(repositories: Repository[]): string {
  let output = '';

  for (let i = 0; i < repositories.length; i += 1) {
    const repo = repositories[i];
    output += `\
<a href="${repo.html_url}" class="repository" target="_blank">
  <div class="repository__name">${repo.full_name}</div>
  <div class="repository__description">
    <p>${repo.description || '-'}</p>
  </div>
  <div class="repository__footer">
    <div class="repository__footer__language">
      <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="code"><polyline fill="none" stroke="#000" stroke-width="1.01" points="13,4 19,10 13,16"></polyline><polyline fill="none" stroke="#000" stroke-width="1.01" points="7,4 1,10 7,16"></polyline></svg>
      <span>${repo.language || '-'}</span>
    </div>
    <div class="repository__footer__star">
      <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="star"><polygon fill="none" stroke="#000" stroke-width="1.01" points="10 2 12.63 7.27 18.5 8.12 14.25 12.22 15.25 18 10 15.27 4.75 18 5.75 12.22 1.5 8.12 7.37 7.27"></polygon></svg>
      <span>${repo.stargazers_count}</span>
    </div>
    <div class="repository__footer__forks">
      <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="git-fork"><circle fill="none" stroke="#000" stroke-width="1.2" cx="5.79" cy="2.79" r="1.79"></circle><circle fill="none" stroke="#000" stroke-width="1.2" cx="14.19" cy="2.79" r="1.79"></circle><circle fill="none" stroke="#000" stroke-width="1.2" cx="10.03" cy="16.79" r="1.79"></circle><path fill="none" stroke="#000" stroke-width="2" d="M5.79,4.57 L5.79,6.56 C5.79,9.19 10.03,10.22 10.03,13.31 C10.03,14.86 10.04,14.55 10.04,14.55 C10.04,14.37 10.04,14.86 10.04,13.31 C10.04,10.22 14.2,9.19 14.2,6.56 L14.2,4.57"></path></svg>
      <span>${repo.forks_count}</span>
    </div>
  </div>
</a>`;
  }

  return output;
}

export default function init(): void {
  const container = document.querySelector('.repositories') as HTMLElement | null;
  const moreButton = document.getElementById('github-more') as HTMLElement | null;

  if (!container || !moreButton) {
    return;
  }

  let remaining: Repository[] = [];
  const data = container.getAttribute('data-more');
  if (data) {
    try {
      remaining = JSON.parse(data);
    } catch {
      remaining = [];
    }
  }

  const count = parseInt(moreButton.dataset.count || '0', 10);

  moreButton.addEventListener('click', () => {
    const html = generateRepositoriesHtml(remaining.splice(0, count));
    const template = document.createElement('template');
    template.innerHTML = html;
    container.append(...Array.from(template.content.childNodes));

    if (remaining.length === 0) {
      moreButton.parentElement?.remove();
    }
  });
}

