import DiagnosticsStore from '../../services/diagnosticsStore';

function init(): void {
  DiagnosticsStore.collect();

  const checkbox = document.querySelector<HTMLInputElement>('#diagnostics-opt-out');
  if (!checkbox) {
    return;
  }

  checkbox.checked = DiagnosticsStore.isOptOut();
  checkbox.addEventListener('change', () => {
    DiagnosticsStore.setOptOut(checkbox.checked);
  });
}

document.addEventListener('DOMContentLoaded', init);
