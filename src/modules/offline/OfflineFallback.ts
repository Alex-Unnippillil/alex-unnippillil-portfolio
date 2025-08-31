export default function showOfflineMessage(message: string, retry: () => void): void {
  if (typeof document === 'undefined') {
    return;
  }

  let container = document.getElementById('offline-fallback');
  if (!container) {
    container = document.createElement('div');
    container.id = 'offline-fallback';
    container.style.padding = '1rem';
    container.style.textAlign = 'center';
    container.style.background = '#fde2e2';
    container.style.color = '#b00020';
    document.body.prepend(container);
  } else {
    container.innerHTML = '';
  }

  const text = document.createElement('p');
  text.textContent = message;
  const button = document.createElement('button');
  button.textContent = 'Try again';
  button.addEventListener('click', () => {
    container?.remove();
    retry();
  });

  container.appendChild(text);
  container.appendChild(button);
}
