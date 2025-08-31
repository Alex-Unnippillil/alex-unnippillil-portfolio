import clampAndRound from './utils/validation';

function inputSupports(type: string): boolean {
  const el = document.createElement('input');
  el.setAttribute('type', type);
  return el.type === type;
}

function applyPolyfills() {
  const dateInput = document.getElementById('start-date') as HTMLInputElement | null;
  if (dateInput && !inputSupports('date')) {
    dateInput.type = 'text';
    dateInput.placeholder = 'YYYY-MM-DD';
    dateInput.pattern = '\\d{4}-\\d{2}-\\d{2}';
  }

  const timeInput = document.getElementById('start-time') as HTMLInputElement | null;
  if (timeInput && !inputSupports('time')) {
    timeInput.type = 'text';
    timeInput.placeholder = 'HH:MM';
    timeInput.pattern = '\\d{2}:\\d{2}';
  }
}

function setupForm() {
  const form = document.getElementById('settings-form') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const numberInput = document.getElementById('project-count') as HTMLInputElement | null;
    if (numberInput) {
      const min = numberInput.min ? Number(numberInput.min) : undefined;
      const max = numberInput.max ? Number(numberInput.max) : undefined;
      numberInput.value = String(clampAndRound(Number(numberInput.value), min, max));
    }

    const dateValue = (document.getElementById('start-date') as HTMLInputElement | null)?.value;
    const timeValue = (document.getElementById('start-time') as HTMLInputElement | null)?.value;
    const numberValue = (document.getElementById('project-count') as HTMLInputElement | null)?.value;

    console.log('date', dateValue);
    console.log('time', timeValue);
    console.log('number', numberValue);
  });
}

applyPolyfills();
setupForm();
