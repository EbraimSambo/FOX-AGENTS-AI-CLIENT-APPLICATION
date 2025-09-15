import { RiSideBarLine } from "@remixicon/react";
import Image from "next/image";
import React from "react";
import { IoCreateOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { generateUUID } from "@/helpers/generate-uuid";
import ButtonNewChat from "./button-new-chat";
import { useRouter } from "next/navigation";

interface Props {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
}

const SidebarTop = ({ setMenuOpen, menuOpen }: Props) => {
  const router = useRouter();

  const handleClick = () => {
    const uuid = generateUUID();
    router.push(`/chats/${uuid}`);
  };
  return (
    <div
      className={`flex items-center justify-between ${menuOpen && "w-[350px] px-6"} p-4 fixed top-0 left-0`}
    >
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 cursor-pointer p-2 px-3 hover:bg-muted-foreground/20 rounded-xl -translate-x-4"
            onClick={handleClick}
          >
            <Image
              src={"/logo.png"}
              priority
              alt="logo"
              width={26}
              height={26}
            />
            <h1 className="font-semibold text-lg">Fox Agents</h1>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center">
        <button
          onClick={() => setMenuOpen((e) => !e)}
          className="h-9 w-9 rounded-md flex items-center justify-center hover:bg-muted-foreground/15"
        >
          <RiSideBarLine className="size-6" />
        </button>
        <ButtonNewChat />
      </div>
    </div>
  );
};

export default SidebarTop;
