import React from "react";
import {
  type PasswordUpdate,
  PasswordUpdateSchema,
} from "~/schemas/sessionSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Form from "~/components/_common/Form";
import { api } from "~/utils/api";
import Button from "~/components/_common/Button";
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
          onError: (error) => {
            toast.error(error.message);
          },
        });
      }}
    >
      <Form.Password
        path="prevPassword"
        label="Contraseña actual"
        placeholder="Escribe tu contraseña"
      />
      <div></div>
      <Form.Password
        label="Nueva contraseña"
        placeholder="Escribe tu nueva contraseña"
        path="password"
      />
      <Form.Password
        label="Confirma tu contraseña"
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
