export interface Pagination<T> {
  items: Array<T>;
  totalPages: number;
  totalElements: number;
  page: number;
  prevPage: number | null;
  nextPage: number | null;
  isHasPage: boolean;
}

export type TypeModel =  "GPT" | "GEMINI" | "CLAUDE" | "OLLAMA"

export interface Message {
  chatId: number;
  content: string;
  createdAt: string;
  id: number;
  role: "USER" | "MODEL";
  uuid: string;
  model: TypeModel
  attachments: Array<{
    url: string,
    type: string
  }>
}

export type Content = Omit<Message, "id" | "chatId" | "createdAt"> & {
  pending?: boolean;
  error?: string | null;
  isAudio?: boolean;
  audioUrl?: string;
  isWriting: boolean;
};


export interface Chat {
  title: string | null
  uuid: string
  createdAt: string
}