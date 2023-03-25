import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import React from "react";

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: () => JSX.Element;
  pageProps: { session: Session | null };
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
