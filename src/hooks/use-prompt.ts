import { zodResolver } from "@hookform/resolvers/zod";
import React  from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { suggestions } from "../components/chat/data-suggestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAxiosInstance } from "@/config/axios";
import { AxiosError } from "axios";
import { Content, Message,TypeModel } from "@/core/chat";
import { useSession } from "next-auth/react";
import { useQueryState } from "nuqs";

const schema = z.object({
  prompt: z.string().optional(),
  model: z.string().optional(),
  files: z
  .array(z.instanceof(File)).optional(),
});

const axios = createAxiosInstance();

interface Props {
  chatUUID: string;
  setMessages: React.Dispatch<React.SetStateAction<Content[]>>;
  messages: Content[];
}

export const usePrompt = ({ chatUUID, setMessages, messages }: Props) => {
  const { data: session } = useSession();
  const [lastMessageUser, setLastMessageUser] = React.useState<
    Content | undefined
  >(undefined);
  const [isPending, setIsPending] = React.useState(false);
  const [forceDone, setForceDone] = React.useState(false);
  const [_,setQueryParams] = useQueryState("new");
  const [abortController, setAbortController] =
    React.useState<AbortController | null>(null);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const [selectedCategory, setSelectedCategory] = React.useState<
    (typeof suggestions)[0] | undefined
  >(undefined);
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      const formData = new FormData();
      
      // Adicionar prompt
      if (data.prompt) {
        formData.append("prompt", data.prompt);
      }
      
      // Adicionar model se existir
      if (data.model) {
        formData.append("model", data.model);
      }
      
      // Adicionar UUID do chat
      formData.append("uuid", chatUUID);
      
      // Adicionar arquivos
      if (Array.isArray(data.files) && data.files.length > 0) {
        data.files.forEach((file) => {
          if (file instanceof File) {
            formData.append("files", file);
          }
        });
      }
      
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      // CORREÇÃO PRINCIPAL: Enviar o FormData diretamente, não dentro de um objeto
      return axios.post<{
        title: string;
        messages: Array<Message>;
      }>(
        `/chats/${chatUUID}`,
        formData, // Enviar FormData diretamente
        {
          headers: {
            "user-x-uuid": session?.id,
            "user-x-name": session?.user?.name,
            // Não definir Content-Type manualmente - deixar o browser definir com boundary
          },
        },
      );
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
      setQueryParams("")
      queryClient.invalidateQueries({ queryKey: ["chats"] });
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
    setForceDone(false);
    const files = form.getValues("files");
    const model = form.getValues("model");
    const value = form.getValues("prompt") || `Descreva por favor`;

    
    console.log("Sending data:", { value, files, model });
    const blobs =  files?.map((file)=>URL.createObjectURL(file)) || []
    
    
    const userMsg: Content = {
      uuid: crypto.randomUUID(),
      role: "USER",
      content: value || `Descreva esta${files && files?.length > 1 ? "s":""} imagen${files && files?.length > 1 ? "s":""}`,
      isWriting: false,
      model: form.getValues("model")  as TypeModel,
      attachments: blobs.map((blob)=>({
        url: blob,
        type: blob
      })) || []
    };
    
    const pendingModel: Content = {
      uuid: crypto.randomUUID(),
      role: "MODEL",
      content: "",
      pending: true,
      isWriting: false,
      model: form.getValues("model")  as TypeModel,
      attachments: []
    };
    
    setMessages((prev) => [...prev, userMsg, pendingModel]);
    setLastMessageUser(userMsg);
    form.reset();
    
    mutation.mutate({
      prompt: value,
      model: model,
      files: files || []
    });
    
    setSelectedCategory(undefined);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  function handleRetry(failedMessageId: string) {
    setIsPending(true);
    setForceDone(false);
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
    const files = form.getValues("files");
    const blobs =  files?.map((file)=>URL.createObjectURL(file)) || []
    const pendingModel: Content = {
      uuid: crypto.randomUUID(),
      role: "MODEL",
      content: "",
      pending: true,
      isWriting: false,
      model: form.getValues("model")  as TypeModel,
      attachments: blobs.map((blob)=>({
        url: blob,
        type: blob
      })) || []
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
    mutation.mutate({ 
      prompt: userMessage.content,
      model: form.getValues("model"),
      files: form.getValues("files") || []
    });
  }

  function stopRequest() {
    if (abortController) {
      abortController.abort();
    }

    form.reset()
    setIsPending(false);
    setForceDone(true);
    setAbortController(null);

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

  function handleTypewriterComplete() {
    if (!forceDone) {
      setIsPending(false);
    }

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
    handleTypewriterComplete,
  };
};