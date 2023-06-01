import React from "react";
import { Toaster } from "react-hot-toast";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import Layout from "~/components/Layout";
import { ModalProvider } from "~/context/ModalContex";
import "~/styles/globals.css";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relative from "dayjs/plugin/relativeTime";
import { ConfigProvider } from "antd";
import esEs from "antd/locale/es_ES";

dayjs.extend(relative);
dayjs.locale("es");

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: () => JSX.Element;
  pageProps: { session: Session | null };
}) => {
  return (
    <SessionProvider session={session}>
      <ConfigProvider
        locale={esEs}
        theme={{
          token: {
            colorPrimary: "#F97561",
            colorTextPlaceholder: "#817D7D",
          },
        }}
      >
        <ModalProvider>
          <Toaster />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ModalProvider>
      </ConfigProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
