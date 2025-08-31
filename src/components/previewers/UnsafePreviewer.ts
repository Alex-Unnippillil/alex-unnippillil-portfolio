import BasePreviewer from './BasePreviewer';

export default class UnsafePreviewer extends BasePreviewer {
  public async preview(): Promise<void> {
    const div = document.createElement('div');
    div.className = 'previewer-unsafe';
    div.textContent = 'Preview disabled for security reasons.';
    this.content.appendChild(div);
  }
}
