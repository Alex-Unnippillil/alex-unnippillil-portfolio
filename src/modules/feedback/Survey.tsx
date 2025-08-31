export interface SurveyResponse {
  rating: number;
  comment: string;
  timestamp: number;
}

export default class Survey {
  private container: HTMLDivElement;

  private selectedRating: number | null = null;

  private storageKey = 'feedback-survey';

  constructor() {
    this.container = document.createElement('div');
    this.container.style.position = 'fixed';
    this.container.style.bottom = '10px';
    this.container.style.right = '10px';
    this.container.style.backgroundColor = '#fff';
    this.container.style.border = '1px solid #ccc';
    this.container.style.padding = '10px';
    this.container.style.zIndex = '9999';

    const title = document.createElement('p');
    title.textContent = 'How likely are you to recommend us?';
    this.container.appendChild(title);

    const ratingContainer = document.createElement('div');
    ratingContainer.style.display = 'flex';
    ratingContainer.style.gap = '4px';

    for (let i = 0; i <= 10; i += 1) {
      const btn = document.createElement('button');
      btn.textContent = i.toString();
      btn.addEventListener('click', () => {
        this.selectedRating = i;
      });
      ratingContainer.appendChild(btn);
    }
    this.container.appendChild(ratingContainer);

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Additional feedback';
    textarea.style.display = 'block';
    textarea.style.marginTop = '8px';
    this.container.appendChild(textarea);

    const submit = document.createElement('button');
    submit.textContent = 'Submit';
    submit.style.display = 'block';
    submit.style.marginTop = '8px';
    submit.addEventListener('click', () => {
      if (this.selectedRating === null) {
        return;
      }
      this.saveResponse(this.selectedRating, textarea.value);
      this.container.remove();
    });
    this.container.appendChild(submit);
  }

  public mount(): void {
    document.body.appendChild(this.container);
  }

  private saveResponse(rating: number, comment: string): void {
    const store = localStorage.getItem(this.storageKey);
    const data: SurveyResponse[] = store ? JSON.parse(store) : [];
    data.push({ rating, comment, timestamp: Date.now() });
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}
