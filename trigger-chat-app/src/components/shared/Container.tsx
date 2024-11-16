import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="container mx-auto max-w-4xl">
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  );
};
