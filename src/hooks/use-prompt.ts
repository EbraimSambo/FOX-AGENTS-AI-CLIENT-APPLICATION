import { zodResolver } from "@hookform/resolvers/zod";
import React, { use } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { suggestions } from "../components/chat/data-suggestions";
import {
  useMutation,
} from "@tanstack/react-query";
import { createAxiosInstance } from "@/config/axios";
import { AxiosError } from "axios";
import { Content, Message, Pagination } from "@/core/chat";

const schema = z.object({
  prompt: z.string(),
});

const axios = createAxiosInstance();
interface Props {
  chatUUID: string;
  setMessages: React.Dispatch<React.SetStateAction<Content[]>>;
  messages: Content[];
}
export const usePrompt = ({ chatUUID, setMessages, messages }: Props) => {
  const [lastMessageUser, setLastMessageUser] = React.useState<
    Content | undefined
  >(undefined);
  const [isPending, setIsPending] = React.useState(false);
  const [forceDone, setForceDone] = React.useState(false);
  const [abortController, setAbortController] =
    React.useState<AbortController | null>(null);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const [selectedCategory, setSelectedCategory] = React.useState<
    (typeof suggestions)[0] | undefined
  >(undefined);

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      return axios.post<{
        title: string;
        messages: Array<Message>;
      }>(`/chats/${chatUUID}`, {
        uuid: chatUUID,
        ...data,
      });
    },
    onError: (error: AxiosError) => {
      setIsPending(false);
      console.log(error);
      setMessages((prev) =>
        prev.map((m) => {
          if (m.pending) {
            return {
              ...m,
              pending: false,
              error: "Falha ao obter resposta, tente novamente.",
            };
          }
          if (
            m.role === "USER" &&
            lastMessageUser &&
            m.uuid === lastMessageUser.uuid
          ) {
            return { ...m, error: "Erro ao enviar mensagem" };
          }
          return m;
        }),
      );
      setLastMessageUser(undefined);
    },
    onSuccess: (res) => {
      setLastMessageUser(undefined);
      console.log(res.data);
      const modelReply = res.data.messages.find((m) => m.role === "MODEL");

      if (modelReply) {
        setMessages((prev) =>
          prev.map((m) =>
            m.pending
              ? {
                  ...m,
                  content: modelReply.content,
                  pending: false,
                  isWriting: true,
                }
              : m,
          ),
        );
      }
    },
  });

  const handleCategoryClick = (categoryName: string) => {
    form.setValue("prompt", categoryName, { shouldValidate: true });
    form.setFocus("prompt");
    const category = suggestions.find((cat) => cat.category === categoryName);
    setSelectedCategory(category);
  };

  const handleSuggestionClick = (suggestion: string) => {
    form.setValue("prompt", suggestion, { shouldValidate: true });
    form.setFocus("prompt");
    setSelectedCategory(undefined);
    handleSend();
  };

  const handleTextareaChange = (value: string) => {
    form.setValue("prompt", value, { shouldValidate: true });

    if (!value.trim()) {
      setSelectedCategory(undefined);
    } else {
      const category = suggestions.find((cat) => cat.category === value.trim());
      setSelectedCategory(category ?? undefined);
    }
  };

  const handleSend = () => {
    setIsPending(true);
    setForceDone(false); // Reset forceDone when sending new message
    const value = form.getValues("prompt");
    if (value.trim()) {
      const userMsg: Content = {
        uuid: crypto.randomUUID(),
        role: "USER",
        content: value,
        isWriting: false,
      };
      const pendingModel: Content = {
        uuid: crypto.randomUUID(),
        role: "MODEL",
        content: "",
        pending: true,
        isWriting: false,
      };
      setMessages((prev) => [...prev, userMsg, pendingModel]);
      setLastMessageUser(userMsg);
      form.reset();
      mutation.mutate({
        prompt: value,
      });
      setSelectedCategory(undefined);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  function handleRetry(failedMessageId: string) {
    setIsPending(true);
    setForceDone(false); // Reset forceDone when retrying
    const failedMessage = messages.find((m) => m.uuid === failedMessageId);
    if (!failedMessage) return;

    const failedIndex = messages.findIndex((m) => m.uuid === failedMessageId);
    const userMessage =
      failedMessage.role === "USER"
        ? failedMessage
        : messages
            .slice(0, failedIndex)
            .reverse()
            .find((m) => m.role === "USER");

    if (!userMessage) return;

    const pendingModel: Content = {
      uuid: crypto.randomUUID(),
      role: "MODEL",
      content: "",
      pending: true,
      isWriting: false,
    };

    setMessages((prev) => {
      const newMessages = [...prev];
      const targetIndex = newMessages.findIndex(
        (m) => m.uuid === failedMessageId,
      );

      if (failedMessage.role === "MODEL") {
        newMessages[targetIndex] = pendingModel;
      } else {
        newMessages[targetIndex] = { ...failedMessage, error: undefined };
        newMessages.splice(targetIndex + 1, 0, pendingModel);
      }

      return newMessages;
    });

    setLastMessageUser(userMessage);
    mutation.mutate({ prompt: userMessage.content });
  }

  function stopRequest() {
    // Cancel the ongoing HTTP request
    if (abortController) {
      abortController.abort();
    }

    setIsPending(false);
    setForceDone(true);
    setAbortController(null);

    // Update any pending messages to show they were cancelled
    setMessages((prev) =>
      prev.map((m) =>
        m.pending
          ? {
              ...m,
              pending: false,
              content: "Requisição cancelada pelo usuário.",
            }
          : m,
      ),
    );
  }

  // New function to handle when typewriter finishes
  function handleTypewriterComplete() {
    // Only set isPending to false if the request wasn't manually stopped
    if (!forceDone) {
      setIsPending(false);
    }

    // Update the message to mark isWriting as false
    setMessages((prev) =>
      prev.map((m) => (m.isWriting ? { ...m, isWriting: false } : m)),
    );
  }

  return {
    form,
    handleKeyPress,
    handleTextareaChange,
    handleCategoryClick,
    handleSuggestionClick,
    handleSend,
    setSelectedCategory,
    selectedCategory,
    mutation,
    handleRetry,
    isPending,
    stopRequest,
    forceDone,
    setForceDone,
    handleTypewriterComplete, // Add this new function
  };
};
