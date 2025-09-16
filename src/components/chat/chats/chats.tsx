import DialogContent, {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { ArrowLeft, Search, SquarePen, TextSearch, X } from "lucide-react";
import { userGetChats } from "@/hooks/get-chat";
import { ptBR } from "date-fns/locale";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgressCircle } from "@/components/ui/progress";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";

const Chats = () => {
  const [open, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [name] = useDebounce(searchQuery, 1000);
  const query = userGetChats(name);
  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [
    inView,
    query.hasNextPage,
    query.isFetchingNextPage,
    query.fetchNextPage,
  ]);
  const chats = query.data?.pages.flatMap((page) => page.items) || [];
  const today = new Date().toISOString().split("T")[0];
  const todayChats = chats.filter(
    (chat) => chat.createdAt.split("T")[0] === today,
  );
  const last7DaysChats = chats.filter(
    (chat) =>
      chat.createdAt.split("T")[0] !== today &&
      parseISO(chat.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  );
  const formatChatDate = (isoDate: string) => {
    const date = parseISO(isoDate);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diffInDays <= 7
      ? `Há ${formatDistanceToNow(date, { locale: ptBR })}`
      : format(date, "dd/MM/yyyy", { locale: ptBR });
  };
  const isSearching = searchQuery.length > 0;
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="px-1">
        <button className="h-9 w-9 rounded-md flex items-center justify-center hover:bg-muted-foreground/15">
          <TextSearch className="size-6" />
        </button>
      </DialogTrigger>
      <DialogContent
        className="p-0 bg-[#323130] border-none text-white max-w-7xl w-full h-[80vh] [&>button]:hidden z-90"
        variant={"default"}
      >
        <DialogHeader className="pt-5 pb-3 m-0 border-b border-muted-foreground">
          <div className="px-6 text-base flex items-center justify-between">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-transparent outline-none w-full"
            />
            <Search />
          </div>
        </DialogHeader>
        <ScrollArea className="text-sm  h-full my-3 ps-6 pe-5 me-1">
          <div className="space-y-4 text-white">
            <div className="space-y-1">
              <h2 className="text-[10px] pl-2 ">Ações</h2>
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="p-2 h-10 w-full flex items-center gap-2 rounded-lg hover:bg-muted-foreground/75 transition-colors"
              >
                <SquarePen className="size-4" />
                <span className="text-sm">Novo chat</span>
              </Link>
            </div>
            {query.isLoading && (
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded-lg w-full " />
                ))}
              </div>
            )}
            {(todayChats.length > 0 || last7DaysChats.length > 0) && (
              <>
                {todayChats.length > 0 && (
                  <div className="space-y-1">
                    <h2 className="text-[10px] pl-2 text-white">Hoje</h2>
                    {todayChats.map((chat) => (
                      <Link
                        href={`/chats/${chat.uuid}`}
                        key={chat.uuid}
                        // onMouseEnter={() => setChatRef(chat.ref)}
                        onClick={() => setIsOpen(false)}
                        className="p-2 h-10 w-full flex items-center justify-between gap-2 rounded-lg hover:bg-muted-foreground/75 transition-colors"
                      >
                        <span className="text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[70%]">
                          {chat.title}
                        </span>
                        <span className="text-[10px]">
                          {formatChatDate(chat.createdAt)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
                {last7DaysChats.length > 0 && (
                  <div className="space-y-1">
                    <h2 className="text-[10px] pl-2 text-white">
                      Últimos 7 dias
                    </h2>
                    {last7DaysChats.map((chat) => (
                      <Link
                        href={`/chats/${chat.uuid}`}
                        key={chat.title}
                        // onMouseEnter={() => setChatRef(chat.ref)}
                        onClick={() => setIsOpen(false)}
                        className="p-2 h-10 w-full flex items-center justify-between gap-2 rounded-lg hover:bg-muted-foreground/75  transition-colors"
                      >
                        <span className="text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[70%]">
                          {chat.title}
                        </span>
                        <span className="text-[10px]">
                          {formatChatDate(chat.createdAt)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
            {!query.isLoading && !query.isError && chats.length === 0 && (
              <div className="text-sm text-center">
                {isSearching
                  ? "Nenhuma conversa encontrada."
                  : "Nenhum chat disponível."}
              </div>
            )}
            {query.hasNextPage && (
              <div ref={ref} className="h-10 flex items-center justify-center">
                {query.isFetchingNextPage || query.isFetching ? (
                  <ProgressCircle
                    value={15}
                    size={15}
                    strokeWidth={2}
                    className="text-white animate-spin"
                  />
                ) : (
                  <span className="text-sm text-slate-600">
                    Carregando mais...
                  </span>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <DialogClose asChild>
            <button className="" >
              <ArrowLeft />
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Chats;
