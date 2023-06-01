import { type GetServerSideProps } from "next";
import React from "react";
import Pets from "~/components/Pets";
import { getServerAuthSession } from "~/server/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};

const PetPage = () => {
  return <Pets />;
};

export default PetPage;
