import React from "react";
import Title from "~/components/_common/Typo/Title";
import { type GetServerSideProps } from "next";
import UpdateUser from "~/components/Me/UpdateUser";
import UpdatePassword from "~/components/Me/UpdatePassword";
import { getServerAuthSession } from "~/server/auth";
const Me = () => {
  return (
    <div>
      <div className="flex max-w-4xl flex-col gap-12">
        <Title as="h3">Información de la cuenta</Title>
        <UpdateUser />
        <Title as="h3">Actualizar Contraseña</Title>
        <UpdatePassword />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default Me;
