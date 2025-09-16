import { motion } from "framer-motion";
import React from "react";
import { Content } from "@/core/chat";
import Typewriter from "../Typewriter";
import MessageAgent from "./message-agent";
import ProcessChat from "./process-chat";
import UserMenssage from "./user-menssage";

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
        <ProcessChat />
      ) : (
        <>
          {isUser ? (
            <UserMenssage message={message} onRetry={onRetry}/>
          ) : (
            <div className="p-2 rounded-xl text-white break-words relative">
              {message.isWriting ? (
                <Typewriter
                  text={message.content}
                  onDone={() => {
                    console.log(
                      "Typewriter finished for message:",
                      message.uuid,
                    );
                  }}
                  onTypewriterComplete={handleTypewriterComplete}
                  forceDone={forceDone}
                />
              ) : (
                <MessageAgent message={message} />
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};
