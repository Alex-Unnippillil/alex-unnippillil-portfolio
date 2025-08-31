import React, { useEffect, useRef, useState } from 'react';
import transcribe from '../speech/transcribe';

interface VoiceNotePlayerProps {
  src: string;
  showCaption?: boolean;
}

const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({ src, showCaption = true }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [caption, setCaption] = useState('');

  const togglePlayback = (): void => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (audio.paused) {
      void audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  useEffect(() => {
    let active = true;
    async function run() {
      if (showCaption) {
        try {
          const text = await transcribe();
          if (active && text) {
            setCaption(text);
          }
        } catch {
          // ignore transcription errors
        }
      }
    }
    run();
    return () => {
      active = false;
    };
  }, [src, showCaption]);

  return React.createElement(
    'div',
    null,
    React.createElement('audio', { ref: audioRef, src }),
    React.createElement(
      'button',
      { type: 'button', onClick: togglePlayback },
      playing ? 'Pause' : 'Play',
    ),
    showCaption && caption ? React.createElement('p', null, caption) : null,
  );
};

export default VoiceNotePlayer;
