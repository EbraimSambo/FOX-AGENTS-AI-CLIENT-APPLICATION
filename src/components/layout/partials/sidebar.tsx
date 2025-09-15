"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarTop from "./sidbar-top";
import Chats from "@/components/chat/chats/chats";
import Link from "next/link";
import { RiImageLine } from "@remixicon/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import RecentChats from "./recent-chats";

interface Props {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
}

const Sidebar = ({ setMenuOpen, menuOpen }: Props) => {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: menuOpen ? 400 : 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="h-full text-white"
    >
      <SidebarTop menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <motion.div
        initial={{ display: "none", padding: 0 }}
        animate={{
          display: menuOpen ? "block" : "none",
          paddingTop: menuOpen ? 70 : 70,
          paddingRight: menuOpen ? 4 : 0,
          paddingLeft: menuOpen ? 4 : 0,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className=""
      >
        <div className="space-y-2">
          <Chats />
          <Link
            href={"/images"}
            className="transition-colors duration-150 flex items-center gap-2 p-2 rounded-md  w-full hover:bg-muted-foreground/20 border border-transparent hover:border-muted-foreground/30"
          >
            <RiImageLine />
            <span className="text-md">Imagens</span>
          </Link>
          <RecentChats />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
