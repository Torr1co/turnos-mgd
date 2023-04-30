import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import { Poppins } from "next/font/google";
import "~/styles/globals.css";
import React from "react";
import { cn } from "~/utils/styles";

const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
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
      <main
        className={cn(poppins.className, "font-custom text-base text-gray-600")}
      >
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
