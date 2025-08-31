import BasePreviewer from './BasePreviewer';

export default class ImagePreviewer extends BasePreviewer {
  public async preview(input: Blob | string): Promise<void> {
    const img = document.createElement('img');
    img.className = 'previewer-image';
    if (typeof input === 'string') {
      img.src = input;
    } else {
      img.src = URL.createObjectURL(input);
    }
    this.content.appendChild(img);
  }
}
