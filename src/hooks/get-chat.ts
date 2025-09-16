import { createAxiosInstance } from "@/config/axios";
import { Chat, Content, Pagination } from "@/core/chat";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const axios = createAxiosInstance();

export const userGetMessagesByChatUUID = (chatUUID: string) => {
  return useInfiniteQuery({
    queryKey: ["messages", chatUUID],
    queryFn: async ({ pageParam = 1 }) =>
      axios
        .get<
          Pagination<Content>
        >(`/chats/messages/${chatUUID}?page=${pageParam}&limit=20`, {})
        .then((res) => res.data),
    initialPageParam: 1,
    enabled: !!chatUUID,
    getNextPageParam: (lastPage) =>
      lastPage.isHasPage ? lastPage.nextPage : undefined,
    refetchOnWindowFocus: false,
  });
};

export const userGetChats = (name?: string) => {
  const { data: session } = useSession();
  return useInfiniteQuery({
    queryKey: ["chats", session?.id, name],
    queryFn: async ({ pageParam = 1 }) =>
      axios
        .get<Pagination<Chat>>(`/chats?page=${pageParam}&limit=20`, {
          headers: {
            "user-x-uuid": session?.id,
          },
          params: {
            name,
          },
        })
        .then((res) => res.data),
    initialPageParam: 1,
    enabled: !!session?.id,
    getNextPageParam: (lastPage) =>
      lastPage.isHasPage ? lastPage.nextPage : undefined,
    refetchOnWindowFocus: false,
  });
};
