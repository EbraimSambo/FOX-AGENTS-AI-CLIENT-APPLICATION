import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const RecentChats = () => {
  return (
    <div className="h-full">
      <h2 className="p-3 text-muted">Chats</h2>
      <ScrollArea className="h-[66vh] w-full">
        <div className="px-1">
          {Array.from({ length: 48 }).map((_, index) => (
            <div
              className="transition-colors duration-150 text-xs flex items-center gap-2 p-2 rounded-md cursor-pointer  w-full hover:bg-muted-foreground/20 border border-transparent hover:border-muted-foreground/30"
              key={index}
            >
              Melhor amigo {index}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RecentChats;
