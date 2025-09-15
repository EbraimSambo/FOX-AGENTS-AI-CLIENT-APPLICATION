import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";
import { Content } from "@/core/chat";
import { RiFileCopyLine } from "@remixicon/react";
import Typewriter from "./Typewriter";

interface Props {
  message: Content;
  onRetry: () => void;
  stopRequest: () => void;
  setForceDone: React.Dispatch<React.SetStateAction<boolean>>;
  forceDone: boolean;
  handleTypewriterComplete: () => void;
}

export const Bubble: React.FC<Props> = ({
  message,
  onRetry,
  stopRequest,
  forceDone,
  setForceDone,
  handleTypewriterComplete,
}) => {
  const isUser = message.role === "USER";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="w-full"
    >
      {message.pending ? (
        <div className="flex items-center gap-2">
          <div className="inline-flex gap-1">
            <span className="bg-muted-foreground inline-block h-2 w-2 animate-bounce rounded-full [animation-delay:-0.2s]" />
            <span className="bg-muted-foreground inline-block h-2 w-2 animate-bounce rounded-full [animation-delay:-0.1s]" />
            <span className="bg-muted-foreground inline-block h-2 w-2 animate-bounce rounded-full " />
          </div>
        </div>
      ) : (
        <>
          {isUser ? (
            <div className="text-end">
              <div className="flex justify-end">
                <p className="text-sm font-bold text-white p-2 px-4 max-w-full rounded-xl bg-muted-foreground/20 shadow-md break-words overflow-hidden">
                  {message.content}
                </p>
              </div>
              <div className="flex justify-end px-2">
                <button
                  onClick={() => navigator.clipboard.writeText(message.content)}
                  className="h-8 w-8 flex items-center justify-center text-white"
                >
                  <RiFileCopyLine className="size-4" />
                </button>
                {message.error?.trim() && (
                  <button
                    onClick={onRetry}
                    className="h-8 w-8 flex items-center justify-center text-white"
                  >
                    <RotateCw className="size-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-2 px-4 rounded-xl text-white break-words relative">
              {message.isWriting ? (
                <Typewriter
                  text={message.content}
                  onDone={() => {
                    // Apenas marca que terminou, não chama stopRequest
                    console.log(
                      "Typewriter finished for message:",
                      message.uuid,
                    );
                  }}
                  onTypewriterComplete={handleTypewriterComplete}
                  forceDone={forceDone}
                />
              ) : (
                <Markdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </Markdown>
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};
