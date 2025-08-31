import { interpret, State } from 'xstate';
import wizardMachine from '@src/modules/wizard/wizardMachine';

const STORAGE_KEY = 'wizard-state';

function update(state: any) {
  const stepDisplay = document.getElementById('step-display') as HTMLElement;
  const detailContainer = document.getElementById('detail-container') as HTMLElement;
  const summaryContainer = document.getElementById('summary-container') as HTMLElement;
  const nextButton = document.getElementById('next') as HTMLButtonElement;
  const submitButton = document.getElementById('submit') as HTMLButtonElement;

  stepDisplay.textContent = String(state.value);
  detailContainer.style.display = state.matches('details') ? 'block' : 'none';
  summaryContainer.style.display = state.matches('summary') ? 'block' : 'none';
  submitButton.style.display = state.matches('summary') ? 'inline-block' : 'none';
  nextButton.style.display = state.matches('summary') || state.matches('done') ? 'none' : 'inline-block';
  nextButton.disabled = !state.can({ type: 'NEXT' });

  if (state.changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  const summaryDetail = document.getElementById('summary-detail');
  if (summaryDetail) {
    summaryDetail.textContent = state.context.detail;
  }
}

const service = interpret(wizardMachine).onTransition(update);

const persisted = localStorage.getItem(STORAGE_KEY);
if (persisted) {
  try {
    const resolved = wizardMachine.resolveState(State.create(JSON.parse(persisted)));
    service.start(resolved);
  } catch (e) {
    service.start();
  }
} else {
  service.start();
}

update(service.getSnapshot());

document.getElementById('next')?.addEventListener('click', () => service.send('NEXT'));
document.getElementById('prev')?.addEventListener('click', () => service.send('PREV'));
document.getElementById('submit')?.addEventListener('click', () => service.send('SUBMIT'));

const input = document.getElementById('detail-input') as HTMLInputElement;
input?.addEventListener('input', () => {
  service.send({ type: 'UPDATE', value: input.value });
});
