import React from "react";
import Form from "~/components/_common/Form";
import { useFormContext } from "react-hook-form";

export default function ContactForm() {
  const methods = useFormContext();

  return (
    <div className="grid gap-6 md:grid-cols-2">
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

      <Form.Input path="from" label="Email" type="email" />
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
      <div className="md:col-span-2">
        <Form.TextArea path="message" label="Mensaje" />
      </div>
    </div>
  );
}
