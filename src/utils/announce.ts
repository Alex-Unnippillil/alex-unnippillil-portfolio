export type Politeness = 'polite' | 'assertive';

const lastMessages: Record<Politeness, string> = {
  polite: '',
  assertive: '',
};

function setMessage(message: string, politeness: Politeness): void {
  const region = document.getElementById(`live-region-${politeness}`);
  if (!region) {
    return;
  }

  const text = lastMessages[politeness] === message ? `${message}\u00A0` : message;
  lastMessages[politeness] = message;
  region.textContent = text;
}

export function announce(message: string, politeness: Politeness = 'polite'): void {
  setMessage(message, politeness);
}

export function announcePolite(message: string): void {
  setMessage(message, 'polite');
}

export function announceAssertive(message: string): void {
  setMessage(message, 'assertive');
}

export default announce;
