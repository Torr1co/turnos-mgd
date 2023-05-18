import React from "react";
import { type SessionUpdate, SessionUpdateSchema } from "~/schemas/session";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Form from "~/lib/Form";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Button from "~/lib/Button";
import { toast } from "react-hot-toast";

export default function UpdateUser() {
  const { data: session, update } = useSession();
  const methods = useForm<SessionUpdate>({
    resolver: zodResolver(SessionUpdateSchema),
    defaultValues: {
      name: session?.user.name,
      telephoneNumber: session?.user.telephoneNumber ?? "",
    },
  });
  const { mutate, isLoading } = api.session.update.useMutation({
    onSuccess: async (user) => {
      await update(user);
    },
  });

  return (
    <Form
      className="grid grid-cols-2 gap-6"
      methods={methods}
      onSubmit={({ telephoneNumber, name }) => {
        mutate(
          {
            name,
            telephoneNumber: telephoneNumber
              ? parseInt(telephoneNumber)
              : undefined,
          },
          {
            onSuccess: () => {
              toast.success("Cuenta actualizada");
            },
            onError: () => {
              toast.error("Error al actualizar la cuenta");
            },
          }
        );
      }}
    >
      <Form.Number path="telephoneNumber" label="Telefono" />
      <Form.Input path="name" label="Nombre" />
      <div>
        <Button type="submit" loading={isLoading}>
          Actualizar Cuenta
        </Button>
      </div>
    </Form>
  );
}
