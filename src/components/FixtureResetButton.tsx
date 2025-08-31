export default function FixtureResetButton(): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  window.addEventListener('DOMContentLoaded', () => {
    const button = document.createElement('button');
    button.id = 'fixture-reset-button';
    button.textContent = 'Reset fixtures';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '6px 10px';
    button.style.background = '#fff';
    button.style.border = '1px solid #ccc';
    button.style.cursor = 'pointer';

    button.addEventListener('click', async () => {
      await fetch('/__fixtures__/reset', { method: 'POST' });
      window.location.reload();
    });

    document.body.appendChild(button);
  });
}
