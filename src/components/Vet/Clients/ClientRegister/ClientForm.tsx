import React from "react";
import Form from "~/lib/Form";
import { useFormContext } from "react-hook-form";
import { type ClientCreation } from "~/schemas/user";

export default function ClientForm() {
  const methods = useFormContext<ClientCreation>();
  return (
    <div>
      <div className="flex items-center justify-between"></div>
      <div className="grid grid-cols-2 gap-6">
        <Form.Input path="name" label="Nombre" />
        <Form.Input path="lastname" label="Apellido" />
        <Form.Input
          path="dni"
          label="DNI"
          onChange={(e) => {
            methods.setValue("dni", e.target.value.replace(/[^0-9]/g, ""));
          }}
        />
        <Form.Input path="telephoneNumber" label="Telefono" />
        <div className="col-span-2">
          <Form.Input path="email" label="Email" />
        </div>
        <div className="col-span-2">
          <Form.Input path="password" label="Contraseña" />
        </div>
      </div>
    </div>
  );
}
