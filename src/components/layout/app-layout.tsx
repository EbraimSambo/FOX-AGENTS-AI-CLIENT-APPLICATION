import React from "react";
import Header from "./partials/header";

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className={` bg-[#262626] transition-all`}>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default AppLayout;
