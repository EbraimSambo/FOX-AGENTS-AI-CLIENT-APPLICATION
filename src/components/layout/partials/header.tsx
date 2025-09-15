"use client";
import { generateUUID } from "@/helpers/generate-uuid";
import { RiSideBarLine } from "@remixicon/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import ButtonNewChat from "./button-new-chat";

const Header = () => {
  const router = useRouter();

  const handleClick = () => {
    const uuid = generateUUID();
    router.push(`/chats/${uuid}`);
  };
  return (
    <div className="fixed top-0 left-0 right-0 w-full text-white flex items-center justify-between p-4 px-8">
      <button
        onClick={handleClick}
        className="flex items-center gap-2 p-2 px-3 hover:bg-muted-foreground/20 rounded-xl"
      >
        <Image src={"/logo.png"} priority alt="logo-4" width={26} height={26} />
        <h1 className="font-semibold text-lg">Fox Agents</h1>
      </button>
      <div className="">
        <div className="flex items-center">
          <button className="h-9 w-9 rounded-md flex items-center justify-center hover:bg-muted-foreground/15">
            <RiSideBarLine className="size-6" />
          </button>
          <ButtonNewChat />
        </div>
      </div>
    </div>
  );
};

export default Header;
