export interface TranscribeOptions {
  lang?: string;
}

export const transcribe = async (
  options: TranscribeOptions = {},
): Promise<string | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  const { lang = 'en-US' } = options;
  const SpeechRecognition = (window as any).SpeechRecognition
    || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition || !navigator.permissions) {
    return null;
  }

  try {
    const permissionStatus = await navigator.permissions.query({
      name: 'microphone' as PermissionName,
    });

    if (permissionStatus.state !== 'granted') {
      return null;
    }
  } catch {
    return null;
  }

  return new Promise((resolve, reject) => {
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ');
      resolve(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      reject(event.error);
    };

    recognition.start();
  });
};

export default transcribe;
