import React from "react";
import { type NextPage, type GetServerSideProps } from "next";
import Form from "~/lib/Form";
import { useForm } from "react-hook-form";
import Button from "~/lib/Button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Title from "~/lib/Typo/Title";
import Box from "~/lib/Box";
import { Blob, Blob2 } from "~/lib/icons";
import { useRouter } from "next/router";
import { getServerAuthSession } from "~/server/auth";
import { UserRoles } from "@prisma/client";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const PasswordSchema = z
  .object({
    password: z.string().min(8, "Minimo 8 caracteres"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });
type Auth = z.infer<typeof PasswordSchema>;

const NewPassword: NextPage = () => {
  const methods = useForm<Auth>({
    resolver: zodResolver(PasswordSchema),
  });
  const { data: session } = useSession();
  const { mutate: update } = api.clients.updatePassword.useMutation();
  const router = useRouter();
  return (
    <div className="relative mx-auto max-w-xl">
      <div className="absolute -bottom-24 -left-28">
        <Blob />
      </div>
      <div className="absolute -top-24 -right-24">
        <Blob2 />
      </div>
      <Box className=" relative z-30 bg-white shadow-xl" kind={Box.KINDS.basic}>
        <Form
          methods={methods}
          onSubmit={({ password }) => {
            if (session) {
              update(
                {
                  password,
                  id: session.user.id,
                },
                {
                  onSuccess: () => {
                    void router.push("/");
                  },
                  onError: () => {
                    toast.error("Error al cambiar la contraseña");
                  },
                }
              );
            }
          }}
          className="flex flex-col gap-6"
        >
          <Title>Crea tu contraseña</Title>
          <Form.Input
            label="Contraseña"
            type="password"
            className="test"
            placeholder="Escibe tu contraseña"
            path="password"
          />
          <Form.Input
            label="Confirma tu contraseña"
            type="password"
            className="test"
            placeholder="Vuelve a escribir tu contraseña"
            path="confirm"
          />
          <div>
            <Button type="submit">Cambiar contraseña</Button>
          </div>
        </Form>
      </Box>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (
    session?.user.role !== UserRoles.CLIENT ||
    session.user.passwordVerified
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default NewPassword;
