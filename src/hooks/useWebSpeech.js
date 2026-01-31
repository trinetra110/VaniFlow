import { useState, useEffect, useRef } from "react";

export const useWebSpeech = () => {
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const synth = useRef(window.speechSynthesis);

  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = synth.current.getVoices();
      setVoices(availableVoices);
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = updateVoices;
    }

    updateVoices();
  }, []);

  const speak = (text, voiceURI, rate = 1, onBoundary, onEnd) => {
    cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const selectedVoice = voices.find((v) => v.voiceURI === voiceURI);
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.rate = rate;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      if (onEnd) onEnd();
    };

    if (onBoundary) {
      utterance.onboundary = onBoundary;
    }

    synth.current.speak(utterance);
  };

  const pause = () => {
    if (!isPaused && isSpeaking) {
      synth.current.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (isPaused) {
      synth.current.resume();
      setIsPaused(false);
    }
  };

  const cancel = () => {
    synth.current.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return {
    voices,
    isSpeaking,
    isPaused,
    speak,
    pause,
    resume,
    cancel,
  };
};
