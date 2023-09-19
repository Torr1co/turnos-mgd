import React from "react";
// import { UserRoles } from "@prisma/client";
import { type GetServerSideProps, type NextPage } from "next";
// import { useSession } from "next-auth/react";
import UnregisteredHome from "~/components/Home";
// import ClientHome from "~/components/Home/ClientHome";
// import VetHome from "~/components/Home/VetHome/VetBookings";
import { getServerAuthSession } from "~/server/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  return {
    props: {
      session,
    },
  };
};

const Home: NextPage = () => {
  // if (!session) {
  return <UnregisteredHome />;
  // }
  /* 
  if (session.user.role === UserRoles.OWNER) {
    return <VetHome />;
  }

  return <ClientHome />; */
};

export default Home;
