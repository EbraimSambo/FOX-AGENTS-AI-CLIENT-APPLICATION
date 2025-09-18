import React from "react";
import { AnimatePresence } from "framer-motion";
import { Content } from "@/core/chat";
import { Bubble } from "./blulue";

interface Props {
  messages: Content[];
  handleRetry: (failedMessageId: string) => void;
  forceDone: boolean;
  handleTypewriterComplete: () => void; // Adicione esta prop
}

const ContentChat = ({
  messages,
  handleRetry,
  forceDone,
  handleTypewriterComplete,
}: Props) => {
  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-full pb-15 px-8 xl:px-0 pt-12 xl:pt-0">
      {messages.length > 0 && (
        <div className="flex items-end h-full justify-end flex-col gap-4 mx-auto min-h-[dvh] md:min-h-[100vh]">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <Bubble
                key={m.uuid}
                message={m}
                onRetry={() => handleRetry(m.uuid)}
                forceDone={forceDone}
                handleTypewriterComplete={handleTypewriterComplete} // Passe a função
              />
            ))}
          </AnimatePresence>
          <div ref={bottomRef} className="pb-6" />
        </div>
      )}
    </div>
  );
};

export default ContentChat;
