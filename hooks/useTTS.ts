
import { useState, useCallback, useRef } from 'react';

export const useTTS = () => {
  const [speedIndex, setSpeedIndex] = useState(0); 
  const speeds: number[] = [0.9, 0.6, 0.9]; // Normal: 0.9, Slow: 0.6
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, options?: { rate?: number }) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.volume = 1.0;
    
    if (options?.rate !== undefined) {
      utterance.rate = options.rate;
    } else {
      utterance.rate = speeds[speedIndex];
      setSpeedIndex((prev) => (prev + 1) % 3);
    }

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [speedIndex]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  return { speak, stop, currentSpeed: speeds[speedIndex] };
};
