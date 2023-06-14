import React, { useState } from "react";
import { type NextPage, type GetServerSideProps } from "next";
import { signIn } from "next-auth/react";
import Form from "~/components/_common/Form";
import { useForm } from "react-hook-form";
import Button from "~/components/_common/Button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Title from "~/components/_common/Typo/Title";
import Box from "~/components/_common/Box";
import { Blob, Blob2 } from "~/components/_common/icons";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { getServerAuthSession } from "~/server/auth";
// import { useSession } from "next-auth/react";

const AuthSchema = z.object({
  email: z.string().trim().email("Email invalido"),
  password: z.string().min(8, "Minimo 8 caracteres"),
});
type Auth = z.infer<typeof AuthSchema>;

const SignIn: NextPage = () => {
  const [loading, setLoading] = useState(false);

  const methods = useForm<Auth>({
    resolver: zodResolver(AuthSchema),
  });
  const router = useRouter();
  // const { data: session } = useSession();
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
          onSubmit={async (credentials) => {
            if (!credentials.email || !credentials.password) {
              toast.error("Credenciales invalidas");
              return;
            }
            setLoading(true);

            await signIn("credentials", {
              ...credentials,
              redirect: false,
            }).then(async (res) => {
              if (res && res.ok) {
                await router.push("/");
              } else {
                toast.error("Credenciales invalidas");
              }
            });
            setLoading(false);
          }}
          className="flex flex-col gap-6"
        >
          <Title>Bienvenido de vuelta!</Title>
          <Form.Input
            label="Email"
            className="bg"
            path="email"
            placeholder="usuario@email.com"
          />
          <Form.Password
            label="Contraseña"
            className="test"
            placeholder="Escribe tu contraseña"
            path="password"
          />
          <div>
            <Button type="submit" loading={loading}>
              Iniciar Sesion
            </Button>
          </div>
        </Form>
      </Box>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (session) {
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

export default SignIn;
