"use client"
import React from "react";
import Header from "./partials/header";
import { useSession } from "next-auth/react";
import LoaderApp from "./loader-app";

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
    const [showLoader, setShowLoader] = React.useState(true);
  const session = useSession()
   React.useEffect(() => {
      if (session.status != "loading") {
        const timeout = setTimeout(() => {
          setShowLoader(false);
        }, 1000); 
  
        return () => clearTimeout(timeout);
      }
    }, [session.status]);
  if(session.status == "loading"|| showLoader) return <LoaderApp />
  return (
    <div className={`bg-[#262626] transition-all`}>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default AppLayout;
