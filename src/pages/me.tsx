import React from "react";
import Title from "~/components/_common/Typo/Title";
import { type GetServerSideProps } from "next";
import UpdateUser from "~/components/Me/UpdateUser";
import UpdatePassword from "~/components/Me/UpdatePassword";
import { getServerAuthSession } from "~/server/auth";
import Button from "~/components/_common/Button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import StickyLayout from "~/components/Layout/StickyLayout";

const Me = () => {
  const router = useRouter();
  return (
    <div>
      <StickyLayout>
        <div className=" flex flex-col gap-12">
          <Title as="h3">Información de la cuenta</Title>
          <UpdateUser />
          <Title as="h3">Actualizar Contraseña</Title>
          <UpdatePassword />
        </div>
        <div>
          <Button
            onClick={() => {
              void signOut().then(() => router.push("/"));
            }}
          >
            Cerrar sesion
          </Button>
        </div>
      </StickyLayout>
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
