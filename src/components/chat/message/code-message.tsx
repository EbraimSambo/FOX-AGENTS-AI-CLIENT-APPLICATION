"use client";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react"; // ícones legais

const CodeMessage = ({
  children,
  language = "typescript",
}: {
  children: string;
  language?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children as string);
      setCopied(true);

      // depois de 2s volta ao normal
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar: ", err);
    }
  };

  return (
    <div className="relative my-4">
      {/* botão de copiar */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 hover:bg-muted-foreground/70 text-white p-2 rounded-md transition"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>

      {/* bloco de código */}
      <SyntaxHighlighter
        language={language}
        style={dracula}
        PreTag="div"
        className="bg-muted-foreground/20 text-white shadow-md p-4 rounded-md overflow-x-auto"
        codeTagProps={{
          className: "font-mono text-sm",
        }}
        customStyle={{
            backgroundColor: "#171717"
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeMessage;
