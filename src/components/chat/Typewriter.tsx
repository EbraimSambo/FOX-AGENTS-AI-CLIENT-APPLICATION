"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeMessage from "./message/code-message";

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
  const components: Components = {
    code({ inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '')

      return !inline && match ? (
        <CodeMessage
        >
          {children}
        </CodeMessage>
      ) : (
        <CodeMessage>
          {children}
        </CodeMessage>
      )
    },

    a({ href, children }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {children}
        </a>
      )
    },

    img({ src, alt }) {
      return (
        <Image
          src={src as string || ""}
          alt={alt  as string|| 'Sem descricao'}
          fill
          className="max-w-full h-auto rounded-md my-4"
        />
      )
    },

    blockquote({ children }) {
      return (
        <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-700 my-4">
          {children}
        </blockquote>
      )
    },

    h1: ({ children }) => (
      <h1 className="text-2xl font-bold my-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-semibold my-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-medium my-2">{children}</h3>
    ),
    ul: ({ children }) => <ul className="pl-6 list-disc">{children}</ul>,
    ol: ({ children }) => <ol className="pl-6 list-disc">{children}</ol>,
    li: ({ children }) => <li className="">{children}</li>,
    p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
    table: ({ children }) => (
      <table className="table-auto border-collapse border  my-4 w-full text-sm">
        {children}
      </table>
    ),
    thead: ({ children }) => (
      <thead className="">{children}</thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-t border-gray-300">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="border border-gray-300 px-3 py-2 font-semibold text-left">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-gray-300 px-3 py-2">{children}</td>
    ),
  }
  return (
    <div className="prose prose-sm max-w-none">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {displayedText + (displayedText.length < text.length ? "▍" : "")}
      </Markdown>
    </div>
  );
};

export default Typewriter;
