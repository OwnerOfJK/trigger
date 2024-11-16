import {
  useEffect,
  useState,
  type FunctionComponent,
  type PropsWithChildren,
} from "react";

import "./index.css";
import Header from "@/components/shared/Header";

export function Layout(props: PropsWithChildren) {
  return (
    <div className="h-full w-full flex flex-col h-screen">
      <Header />
      {props.children}
    </div>
  );
}

export function withLayout<T extends FunctionComponent<any>>(
  Component: T,
  Custom?: FunctionComponent
) {
  function Wither(props: any) {
    return (
      <Layout>
        <main className="flex-1 overflow-auto">
          <Component {...props} />
        </main>
      </Layout>
    );
  }
  return Custom || Wither;
}
