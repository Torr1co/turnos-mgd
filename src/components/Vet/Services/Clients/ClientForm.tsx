import React from "react";
import { type NextPage } from "next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type UserCreation, UserCreationSchema } from "~/schemas/user";
import Form from "~/lib/Form";
import { api } from "~/utils/api";
import Button from "~/lib/Button";

const ClientForm: NextPage = () => {
  const methods = useForm<UserCreation>({
    resolver: zodResolver(UserCreationSchema),
  });
  const hasErrors = Object.keys(methods.formState.errors).length > 0;
  const { mutate: createUser, isLoading } = api.users.create.useMutation();

  return (
    <div className="mx-auto">
      <Form
        methods={methods}
        onSubmit={(data) => {
          createUser(data, {
            onSuccess: () => alert("success"),
            onError: () => alert("error"),
          });
        }}
      >
        <Form.Input path="name" label="Nombre" />
        <Form.Input path="lastname" label="Apellido" />
        <Form.Input path="dni" label="DNI" />
        <Form.Input path="email" label="Email" />
        <Form.Input path="role" label="Role" />
        <Form.Input path="password" label="Contrase" />
        <Button loading={isLoading} disabled={hasErrors}>
          Crear
        </Button>
      </Form>
    </div>
  );
};

export default ClientForm;
