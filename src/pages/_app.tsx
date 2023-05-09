import React from "react";
import { Toaster } from "react-hot-toast";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Layout from "~/components/Layout";
import { ModalProvider } from "~/context/ModalContex";

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: () => JSX.Element;
  pageProps: { session: Session | null };
}) => {
  return (
    <SessionProvider session={session}>
      <ModalProvider>
        <Toaster />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ModalProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
