import React from "react";
import Form from "~/components/_common/Form";
import Title from "~/components/_common/Typo/Title";
import { UserCreationSchema } from "~/schemas/userSchema";
import { api } from "~/utils/api";
import ClientForm from "./UserForm";
import Button from "~/components/_common/Button";
import { toast } from "react-hot-toast";
import { useModal } from "~/context/ModalContex";
import { useForm } from "~/utils/schemaUtils";

export default function ClientRegisterModal() {
  const { handleModal } = useModal();
  const methods = useForm<UserCreationSchema>({
    schema: UserCreationSchema,
  });

  const hasErrors = Object.keys(methods.formState.errors).length > 0;
  const utils = api.useContext();

  const { mutate: createUser, isLoading } = api.clients.create.useMutation({
    onSuccess: async () => {
      await utils.clients.getAll.invalidate();
    },
  });

  return (
    <Form
      className="flex flex-col gap-6"
      methods={methods}
      onSubmit={(data) => {
        createUser(data, {
          onSuccess: () => {
            toast.success("Cliente registrado");
            handleModal();
          },
          onError: (err) => {
            toast.error(err.message);
          },
        });
      }}
    >
      {hasErrors && (
        <div className="rounded-md bg-red-100 p-4 text-red-600">
          <p>Hay errores en el formulario</p>
        </div>
      )}
      <header className="sticky top-10 z-30 -mx-4 flex items-center justify-between bg-white p-4 pb-4">
        <Title as="h4" className="text-gray-500">
          Sobre el <span className="text-primary">Cliente</span>
        </Title>
        <nav className="flex items-center justify-between gap-4">
          <Button
            type="submit"
            size="sm"
            disabled={hasErrors}
            loading={isLoading}
          >
            Registrar Cliente
          </Button>
        </nav>
      </header>
      <ClientForm />
    </Form>
  );
}
