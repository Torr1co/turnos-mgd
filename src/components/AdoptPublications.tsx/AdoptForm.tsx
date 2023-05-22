import React from "react";
import Form from "~/lib/Form";
import { useFormContext } from "react-hook-form";

export default function AdoptForm() {
  const methods = useFormContext();
  return (
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

      <div className="col-span-2">
        <Form.Input
          path="email"
          label="Email"
          onChange={(e) => {
            methods.setValue("email", e.target.value.replace(/[^0-9\s]/g, ""));
          }}
        />
      </div>
      <div className="col-span-2">
        <Form.Input
          path="telephone"
          label="Telefono"
          onChange={(e) => {
            methods.setValue(
              "telephone",
              e.target.value.replace(/[^0-9\s]/g, "")
            );
          }}
        />
      </div>
    </div>
  );
}
