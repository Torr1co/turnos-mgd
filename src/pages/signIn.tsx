import React, { useState } from "react";
import { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Form from "~/lib/Form";
import { useForm } from "react-hook-form";
import Button from "~/lib/Button";
import { api } from "~/utils/api";

const SignIn: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: !!sessionData }
  );
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  console.log(methods.watch());
  return (
    <Form
      methods={methods}
      onSubmit={async (data) => {
        if (!data.email || !data.password) return console.log("no data");
        setLoading(true);
        sessionData
          ? await signOut()
          : await signIn("credentials", { ...data, redirect: false })
              .then((res) => {
                console.log("res", res);
              })
              .catch((err) => {
                console.log("err", err);
              })
              .finally(() => {
                setLoading(false);
              });
      }}
      className="flex flex-col items-center justify-center gap-4"
    >
      <Form.Input
        label="Email"
        className="bg"
        path="email"
        placeholder="Enter your email"
        options={{
          required: true,
        }}
      />
      <Form.Input
        label="Password"
        type="password"
        className="test"
        placeholder="Enter your password"
        path="password"
        options={{
          required: true,
        }}
      />
      <Button type="submit" disabled={loading}>
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
      <p className="text-center text-2xl">
        {sessionData && <span>Logged in as {sessionData.user.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
    </Form>
  );
};

export default SignIn;
