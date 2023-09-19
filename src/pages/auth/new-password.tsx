import React from "react";
import { type NextPage, type GetServerSideProps } from "next";
import Form from "~/components/_common/Form";
import { useForm } from "react-hook-form";
import Button from "~/components/_common/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import Title from "~/components/_common/Typo/Title";
import Box from "~/components/_common/Box";
import { getServerAuthSession } from "~/server/auth";
import { UserRoles } from "@prisma/client";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { LINKS } from "~/utils/navUtils";
import {
  type PasswordUpdate,
  PasswordUpdateSchema,
} from "~/schemas/sessionSchema";
import Image from "next/image";
import { useRouter } from "next/router";

const NewPassword: NextPage = () => {
  const methods = useForm<PasswordUpdate>({
    resolver: zodResolver(PasswordUpdateSchema),
  });
  const { data: session, update } = useSession();
  const router = useRouter();
  const { mutate: updatePassword, isLoading } =
    api.session.updatePassword.useMutation({
      onSuccess: async () => {
        await update({
          passwordVerified: new Date(),
        });
        await router.push("/");
      },
      onError: () => {
        toast.error("Error al cambiar la contraseña");
      },
    });

  return (
    <>
      <Image
        alt="imagen de fondo"
        src={"/images/signinBG.jpg"}
        fill={true}
        className="min-w-screen object-cover"
      />
      <div className="relative mx-auto my-auto h-full w-full max-w-xl">
        <Box
          className="relative z-30 rounded-none bg-white shadow-xl"
          kind={Box.KINDS.basic}
        >
          <Form
            methods={methods}
            onSubmit={({ password }) => {
              if (session) {
                updatePassword({
                  password,
                });
              }
            }}
            className="flex flex-col gap-6"
          >
            <Title>Crea tu contraseña</Title>
            <Form.Password
              label="Contraseña"
              placeholder="Escribe tu contraseña"
              path="password"
            />
            <Form.Password
              label="Confirma tu contraseña"
              placeholder="Vuelve a escribir tu contraseña"
              path="confirm"
            />
            <div>
              <Button type="submit" loading={isLoading}>
                Cambiar contraseña
              </Button>
            </div>
          </Form>
        </Box>
      </div>
      <div className="h-full bg-slate-900"></div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (!session || session.user.role === UserRoles.ADMIN) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  if (session.user.passwordVerified) {
    return {
      redirect: {
        destination: LINKS.me,
        permanent: true,
      },
    };
  }

  return {
    props: { session },
  };
};

export default NewPassword;
