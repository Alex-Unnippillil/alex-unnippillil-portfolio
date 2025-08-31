import BasePreviewer from './BasePreviewer';

export default class VideoPreviewer extends BasePreviewer {
  public async preview(input: Blob | string): Promise<void> {
    const video = document.createElement('video');
    video.className = 'previewer-video';
    video.controls = true;
    if (typeof input === 'string') {
      video.src = input;
    } else {
      video.src = URL.createObjectURL(input);
    }
    this.content.appendChild(video);
  }
}
