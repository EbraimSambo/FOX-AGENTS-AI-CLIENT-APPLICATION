import { createAxiosInstance } from "@/config/axios";
import { Content, Pagination } from "@/core/chat";
import { useInfiniteQuery } from "@tanstack/react-query";

const axios = createAxiosInstance();

export const userGetMessagesByChatUUID = (chatUUID: string) => {
  return useInfiniteQuery({
    queryKey: ["messages", chatUUID],
    queryFn: async ({ pageParam = 1 }) =>
      axios
        .get<Pagination<Content>>(
          `/chats/messages/${chatUUID}?page=${pageParam}&limit=20`,
          {},
        )
        .then((res) => res.data),
    initialPageParam: 1,
    enabled: !!chatUUID,
    getNextPageParam: (lastPage) =>
      lastPage.isHasPage ? lastPage.nextPage : undefined,
    refetchOnWindowFocus: false,
  });
};
