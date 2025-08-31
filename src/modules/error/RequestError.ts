export interface RequestErrorPayload {
  requestId: string;
  summary: unknown;
}

export function buildSupportBundle(payload: RequestErrorPayload): string {
  return JSON.stringify(payload, null, 2);
}

export function openRequestErrorModal(payload: RequestErrorPayload): void {
  const content = buildSupportBundle(payload);
  if (typeof document !== 'undefined') {
    let modal = document.getElementById('request-error-modal');
    if (!modal) {
      modal = document.createElement('pre');
      modal.id = 'request-error-modal';
      modal.style.position = 'fixed';
      modal.style.top = '10px';
      modal.style.right = '10px';
      modal.style.background = '#fff';
      modal.style.border = '1px solid #000';
      modal.style.padding = '10px';
      modal.style.zIndex = '1000';
      document.body.appendChild(modal);
    }
    modal.textContent = content;
  } else {
    console.info(content);
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(content).catch(() => {});
  }
}

export function showRequestErrorToast(payload: RequestErrorPayload): void {
  const message = `Request failed. ID: ${payload.requestId}`;
  if (typeof window !== 'undefined' && typeof window.alert === 'function') {
    window.alert(message);
  } else {
    console.error(message);
  }

  openRequestErrorModal(payload);
}
