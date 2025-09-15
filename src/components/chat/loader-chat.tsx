import Image from "next/image";
import React from "react";

const LoaderChat = () => {
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-2 text-white">
      {/* <Image src={"/logo.png"} height={40} width={40} alt='logo-2' priority className='animate-pulse' /> */}
      <div className="h-8 w-8 bg-white animate-pulse rounded-full"></div>
      {/* <h2>Preparando o seu chat</h2> */}
    </div>
  );
};

export default LoaderChat;
