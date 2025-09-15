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
      // If forceDone is true, complete immediately
      if (forceDone) {
        setDisplayedText(text);
        clearInterval(interval);
        onDone?.();
        onTypewriterComplete?.();
        return;
      }

      setDisplayedText((prev) => prev + text.charAt(i));
      i++;

      if (i >= text.length) {
        clearInterval(interval);
        onDone?.();
        onTypewriterComplete?.(); // Call the new callback when typewriter completes naturally
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
