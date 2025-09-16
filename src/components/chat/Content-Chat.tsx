import React from "react";
import { AnimatePresence } from "framer-motion";
import { Content } from "@/core/chat";
import { Bubble } from "./message/blulue";

interface Props {
  messages: Content[];
  handleRetry: (failedMessageId: string) => void;
  stopRequest: () => void;
  setForceDone: React.Dispatch<React.SetStateAction<boolean>>;
  forceDone: boolean;
  handleTypewriterComplete: () => void; // Adicione esta prop
}

const ContentChat = ({
  messages,
  handleRetry,
  stopRequest,
  forceDone,
  setForceDone,
  handleTypewriterComplete,
}: Props) => {
  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-full pb-20 px-8 xl:px-0">
      {messages.length > 0 && (
        <div className="flex items-end h-full justify-end flex-col gap-4 mx-auto min-h-screen">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <Bubble
                key={m.uuid}
                message={m}
                onRetry={() => handleRetry(m.uuid)}
                stopRequest={stopRequest}
                setForceDone={setForceDone}
                forceDone={forceDone}
                handleTypewriterComplete={handleTypewriterComplete} // Passe a função
              />
            ))}
          </AnimatePresence>
          <div ref={bottomRef} className="pb-10" />
        </div>
      )}
    </div>
  );
};

export default ContentChat;
