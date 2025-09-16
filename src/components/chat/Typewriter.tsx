"use client";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Typewriter = ({
  text,
  onDone,
  onTypewriterComplete,
  forceDone,
}: {
  text: string;
  onDone?: () => void;
  onTypewriterComplete?: () => void;
  forceDone?: boolean;
}) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (forceDone) {
        setDisplayedText(text);
        clearInterval(interval);
        onDone?.();
        onTypewriterComplete?.();
        return;
      }
  
      // velocidade dinâmica: mais longo = pula mais chars
      const step = text.length > 500 ? 3 : 1; // se >500 chars, escreve 3 por vez
      setDisplayedText((prev) => prev + text.slice(i, i + step));
      i += step;
  
      if (i >= text.length) {
        clearInterval(interval);
        onDone?.();
        onTypewriterComplete?.();
      }
    }, 10);
  
    return () => clearInterval(interval);
  }, [text, onDone, onTypewriterComplete, forceDone]);

  return (
    <div className="prose prose-sm max-w-none">
      <Markdown remarkPlugins={[remarkGfm]}>
        {displayedText + (displayedText.length < text.length ? "▍" : "")}
      </Markdown>
    </div>
  );
};

export default Typewriter;
