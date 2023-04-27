import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import { Poppins } from "next/font/google";
import "~/styles/globals.css";
import React from "react";

const poppins = Poppins({
  weight: ["200", "300", "400", "500"],
  subsets: ["latin"],
});

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: () => JSX.Element;
  pageProps: { session: Session | null };
}) => {
  return (
    <SessionProvider session={session}>
      <main className={poppins.className}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
