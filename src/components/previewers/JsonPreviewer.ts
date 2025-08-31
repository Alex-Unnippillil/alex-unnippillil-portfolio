import TextPreviewer from './TextPreviewer';

export default class JsonPreviewer extends TextPreviewer {
  public async preview(input: Blob | string | object): Promise<void> {
    if (typeof input === 'object' && !(input instanceof Blob)) {
      const pre = document.createElement('pre');
      pre.className = 'previewer-json';
      pre.textContent = JSON.stringify(input, null, 2);
      this.content.appendChild(pre);
      return;
    }

    const text = typeof input === 'string' ? input : await input.text();
    const pre = document.createElement('pre');
    pre.className = 'previewer-json';
    try {
      const json = JSON.parse(text);
      pre.textContent = JSON.stringify(json, null, 2);
    } catch (e) {
      pre.textContent = text;
    }
    this.content.appendChild(pre);
  }
}
