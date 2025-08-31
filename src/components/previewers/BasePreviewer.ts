export default abstract class BasePreviewer {
  protected readonly container: HTMLElement;

  protected readonly chrome: HTMLElement;

  protected readonly content: HTMLElement;

  constructor(container?: HTMLElement) {
    this.container = container || document.createElement('div');
    this.container.className = 'previewer';

    this.chrome = document.createElement('div');
    this.chrome.className = 'previewer-chrome';
    this.container.appendChild(this.chrome);

    this.content = document.createElement('div');
    this.content.className = 'previewer-content';
    this.chrome.appendChild(this.content);
  }

  public get element(): HTMLElement {
    return this.container;
  }

  public abstract preview(input: Blob | string | object): Promise<void> | void;
}
