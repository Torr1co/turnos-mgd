import React from "react";
import { type PasswordUpdate, PasswordUpdateSchema } from "~/schemas/session";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Form from "~/lib/Form";
import { api } from "~/utils/api";
import Button from "~/lib/Button";
import { toast } from "react-hot-toast";

export default function UpdatePassword() {
  const methods = useForm<PasswordUpdate>({
    resolver: zodResolver(PasswordUpdateSchema),
  });

  const { mutate, isLoading } = api.session.updatePassword.useMutation();
  return (
    <Form
      className="grid grid-cols-2 gap-6"
      methods={methods}
      onSubmit={(data) => {
        mutate(data, {
          onSuccess: () => {
            toast.success("Contraseña actualizada");
          },
          onError: () => {
            toast.error("Error al actualizar la contraseña");
          },
        });
      }}
    >
      <Form.Input
        path="prevPassword"
        label="Contraseña anterior"
        type="password"
        placeholder="Escribe tu contraseña"
      />
      <div></div>
      <Form.Input
        label="Nueva contraseña"
        type="password"
        placeholder="Escribe tu nueva contraseña"
        path="password"
      />
      <Form.Input
        label="Confirma tu contraseña"
        type="password"
        placeholder="Vuelve a escribir tu nueva contraseña"
        path="confirm"
      />
      <div>
        <Button type="submit" loading={isLoading}>
          Actualizar contraseña
        </Button>
      </div>
    </Form>
  );
}
