import {
  useEffect,
  useState,
  type FunctionComponent,
  type PropsWithChildren,
} from "react";

import "./index.css";
import Header from "@/components/shared/Header";
import { ChatProvider } from "@/components/utils/ChatProvider";
export function Layout(props: PropsWithChildren) {
  return (
    <ChatProvider>
      <div className="min-h-screen w-full flex flex-col">
        <Header />
        <div>{props.children}</div>
      </div>
    </ChatProvider>
  );
}

export function withLayout<T extends FunctionComponent<any>>(
  Component: T,
  Custom?: FunctionComponent
) {
  function Wither(props: any) {
    return (
      <Layout>
        <main className="flex-1">
          <Component {...props} />
        </main>
      </Layout>
    );
  }
  return Custom || Wither;
}
