import { useState, useEffect } from "react";

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export const useTypewriter = ({
  text,
  speed = 30,
  onComplete,
}: UseTypewriterOptions) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [shouldStop, setShouldStop] = useState(false);

  useEffect(() => {
    if (!text || shouldStop) {
      if (shouldStop) {
        setDisplayedText(text);
        setIsTyping(false);
        onComplete?.();
      }
      return;
    }

    setIsTyping(true);
    setDisplayedText("");

    let i = 0;
    const timer = setInterval(() => {
      if (shouldStop) {
        setDisplayedText(text);
        setIsTyping(false);
        clearInterval(timer);
        onComplete?.();
        return;
      }

      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);

    return () => {
      clearInterval(timer);
    };
  }, [text, speed, shouldStop, onComplete]);

  const stopTyping = () => {
    setShouldStop(true);
  };

  const resetTyping = () => {
    setShouldStop(false);
    setDisplayedText("");
    setIsTyping(false);
  };

  return {
    displayedText,
    isTyping,
    stopTyping,
    resetTyping,
  };
};
