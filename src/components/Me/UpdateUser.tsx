import React from "react";
import {
  type SessionUpdate,
  SessionUpdateSchema,
} from "~/schemas/sessionSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Form from "~/components/_common/Form";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Button from "~/components/_common/Button";
import { toast } from "react-hot-toast";

export default function UpdateUser() {
  const { data: session, update } = useSession();
  const methods = useForm<SessionUpdate>({
    resolver: zodResolver(SessionUpdateSchema),
    defaultValues: {
      name: session?.user.name,
      lastname: session?.user.lastname,
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
      onSubmit={(data) => {
        mutate(data, {
          onSuccess: () => {
            toast.success("Cuenta actualizada");
          },
          onError: () => {
            toast.error("Error al actualizar la cuenta");
          },
        });
      }}
    >
      <Form.Input
        path="telephoneNumber"
        label="Telefono"
        onChange={(e) => {
          methods.setValue(
            "telephoneNumber",
            e.target.value.replace(/[^\d\s]/g, "")
          );
        }}
      />
      <Form.Input
        path="name"
        label="Nombre"
        onChange={(e) => {
          methods.setValue(
            "name",
            e.target.value.replace(/[^a-zA-ZñÑ\s]/g, "")
          );
        }}
      />
      <Form.Input
        path="lastname"
        label="Apellido"
        onChange={(e) => {
          methods.setValue(
            "lastname",
            e.target.value.replace(/[^a-zA-ZñÑ\s]/g, "")
          );
        }}
      />
      <div></div>
      <div>
        <Button type="submit" loading={isLoading}>
          Actualizar Cuenta
        </Button>
      </div>
    </Form>
  );
}
