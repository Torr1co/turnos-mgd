import React from "react";
import Form from "~/components/_common/Form";
import { useFormContext } from "react-hook-form";
import { type ClientCreation } from "~/schemas/clientSchema";
import dayjs from "dayjs";

export default function ClientForm() {
  const methods = useFormContext<ClientCreation>();
  return (
    <div>
      <div className="flex items-center justify-between"></div>
      <div className="grid grid-cols-2 gap-6">
        <Form.Input
          path="name"
          label="Nombre"
          onChange={(e) => {
            methods.setValue(
              "name",
              e.target.value.replace(/[^a-zA-ZñÑ\s]/g, "")
            );
          }}
          required
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
          required
        />
        <Form.Input
          path="dni"
          label="DNI"
          onChange={(e) => {
            methods.setValue("dni", e.target.value.replace(/[^0-9]/g, ""));
          }}
          required
        />
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
        <Form.Input path="email" label="Email" type="email" required />
        <Form.Date
          path="birth"
          label="Nacimiento"
          disabledDate={(current) => {
            return current.isAfter(dayjs().subtract(18, "y"), "d");
          }}
        />
      </div>
    </div>
  );
}
