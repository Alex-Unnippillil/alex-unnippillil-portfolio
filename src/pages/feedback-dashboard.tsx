import { SurveyResponse } from '../modules/feedback/Survey';
import { HotspotMetric, loadHotspots } from '../modules/feedback/hotspot';

function loadSurvey(): SurveyResponse[] {
  const data = localStorage.getItem('feedback-survey');
  return data ? JSON.parse(data) : [];
}

function renderSurvey(container: HTMLElement, surveys: SurveyResponse[]): void {
  const title = document.createElement('h2');
  title.textContent = 'Survey Responses';
  container.appendChild(title);

  const list = document.createElement('ul');
  surveys.forEach((s) => {
    const item = document.createElement('li');
    item.textContent = `${s.rating}: ${s.comment}`;
    list.appendChild(item);
  });
  container.appendChild(list);
}

function renderHotspots(container: HTMLElement, hotspots: HotspotMetric[]): void {
  const title = document.createElement('h2');
  title.textContent = 'Hotspot Metrics';
  container.appendChild(title);

  const list = document.createElement('ul');
  hotspots.forEach((h) => {
    const item = document.createElement('li');
    item.textContent = `(${h.x}, ${h.y}) => ${h.count}`;
    list.appendChild(item);
  });
  container.appendChild(list);
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.body;
  renderSurvey(root, loadSurvey());
  renderHotspots(root, loadHotspots());
});
