"use client";
import { Content } from "@/core/chat";
import React from "react";
import PromptAi from "./prompt/prompt-ai";
import ContentChat from "./message/Content-Chat";
import { usePrompt } from "@/hooks/use-prompt";
import { userGetMessagesByChatUUID } from "@/hooks/get-chat";
import LoaderChat from "./loader-chat";
import { useQueryState } from "nuqs";

interface Props {
  chatUUID: string;
}


const Chat = ({ chatUUID }: Props) => {
  const query = userGetMessagesByChatUUID(chatUUID);
  const [queryParams] = useQueryState("new");
  const [messages, setMessages] = React.useState<Content[]>([]);
  const [showLoader, setShowLoader] = React.useState(true);
  React.useEffect(() => {
    if (query.data?.pages) {
      const allMessages = query.data.pages.flatMap(
        (page) =>
          page.items.map((t) => ({
            ...t,
            error: null,
            pending: false,
            isWriting: false,
          })) || [],
      );
      setMessages(allMessages);
    }
  }, [query.data]);

  React.useEffect(() => {
    if (!query.isLoading) {
      const timeout = setTimeout(() => {
        setShowLoader(false);
      }, 2000); // 2000ms = 2 segundos

      return () => clearTimeout(timeout);
    }
  }, [query.isLoading]);

  const {
    form,
    handleCategoryClick,
    handleKeyPress,
    handleSuggestionClick,
    handleTextareaChange,
    handleSend,
    setSelectedCategory,
    selectedCategory,
    isPending,
    handleRetry,
    stopRequest,
    forceDone,
    handleTypewriterComplete, // Adicione esta nova função
  } = usePrompt({
    chatUUID,
    setMessages,
    messages,
  });
  const isLoader = showLoader || query.isLoading
  if (!queryParams && isLoader) return <LoaderChat />;

  return (
    <div className="max-w-3xl w-full mx-auto pt-12 pb-40 ">
      <ContentChat
        forceDone={forceDone}
        handleRetry={handleRetry}
        messages={messages}
        handleTypewriterComplete={handleTypewriterComplete} // Passe a função para ContentChat
      />
      <PromptAi
        stopRequest={stopRequest}
        isPending={isPending}
        showSuggestions={messages?.length == 0}
        form={form}
        handleCategoryClick={handleCategoryClick}
        handleKeyPress={handleKeyPress}
        handleSend={handleSend}
        handleSuggestionClick={handleSuggestionClick}
        handleTextareaChange={handleTextareaChange}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </div>
  );
};

export default Chat;
