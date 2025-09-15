import Chat from "@/components/chat/chat";

interface Params {
  params: Promise<{
    chat: string;
  }>;
}
export default async function Home({ params }: Params) {
  const { chat } = await params;
  return <Chat chatUUID={chat} />;
}
