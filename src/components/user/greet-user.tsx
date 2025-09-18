import { getFirstAndLastName } from "@/helpers/name";
import { useSession } from "next-auth/react";
import React from "react";

const GreetUser = () => {
  const session = useSession()
  return (
    <div className="flex items-center justify-center h-full">
      <h2 className="text-white text-xs md:text-xl xl:text-3xl text-center">
        {session.data?.user ? `Que bom te ver, ${getFirstAndLastName(session.data.user.name as string)}, O que há de novo?` : "Olá, que bom ver-te. O que há de novo?"}
      </h2>
    </div>
  );
};

export default GreetUser;
