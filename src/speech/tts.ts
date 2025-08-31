export interface SpeakOptions {
  lang?: string;
  quiet?: boolean;
}

export const speakSuccess = (
  message: string,
  options: SpeakOptions = {},
): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const { quiet = false, lang = 'en-US' } = options;
  if (quiet || !('speechSynthesis' in window)) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
};

export default speakSuccess;
