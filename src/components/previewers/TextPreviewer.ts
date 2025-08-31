/* eslint-disable no-await-in-loop */
import BasePreviewer from './BasePreviewer';

export default class TextPreviewer extends BasePreviewer {
  public async preview(input: Blob | string): Promise<void> {
    const pre = document.createElement('pre');
    pre.className = 'previewer-text';
    this.content.appendChild(pre);

    if (typeof input === 'string') {
      pre.textContent = input;
      return;
    }

    const reader = input.stream().getReader();
    const decoder = new TextDecoder();
    let result = await reader.read();
    while (!result.done) {
      pre.textContent += decoder.decode(result.value, { stream: true });
      result = await reader.read();
    }
    pre.textContent += decoder.decode();
  }
}
