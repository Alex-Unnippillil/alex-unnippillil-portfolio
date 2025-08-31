import inlineAssets from '../utils/inlineAssets';

export default function SaveAsPdfButton(): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Save as PDF';

  button.addEventListener('click', async () => {
    await inlineAssets();
    window.print();
  });

  return button;
}
