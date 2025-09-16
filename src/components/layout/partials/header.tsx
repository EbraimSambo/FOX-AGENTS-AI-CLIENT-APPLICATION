"use client";
import { generateUUID } from "@/helpers/generate-uuid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import ButtonNewChat from "./button-new-chat";
import Chats from "@/components/chat/chats/chats";
import { useSession } from "next-auth/react";
import AuthDialog from "@/components/auth/auth-dialog";
import UserMenu from "@/components/user/user-menu";

const Header = () => {
  const session = useSession()
  const router = useRouter();
  const handleClick = () => {
    const uuid = generateUUID();
    router.push(`/chats/${uuid}?new=true`);
  };
  return (
    <div className="fixed top-0 left-0 right-0 w-full text-white flex items-center bg-[#262626] md:bg-transparent justify-between p-4 px-2 xl:px-8">
      <button
        onClick={handleClick}
        className="flex items-center gap-2 p-2 px-3 hover:bg-muted-foreground/20 rounded-xl"
      >
        <Image src={"/logo.png"} priority alt="logo-4" width={26} height={26} />
        <h1 className="font-semibold text-lg hidden xl:block">Fox Agents</h1>
      </button>
      <div className="">
        <div className="flex items-center gap-2">
          {session.status == "authenticated" &&  <Chats />}
          <ButtonNewChat />
          {session.status != "authenticated" &&  <AuthDialog />}
          {session.status == "authenticated" && <UserMenu  />}
        </div>
      </div>
    </div>
  );
};

export default Header;
