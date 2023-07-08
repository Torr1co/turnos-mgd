import React from "react";
import {
  type ServiceCreationSchema,
  ServiceOptions,
} from "~/schemas/serviceSchema";
import Form from "../_common/Form";
import { useFormContext } from "react-hook-form";
import Image from "next/image";

export type ServiceFormTypes = "CREATION" | "UPDATE";
export default function ServiceForm({
  type = "CREATION",
}: {
  type?: ServiceFormTypes;
}) {
  const methods = useFormContext<ServiceCreationSchema>();
  const photo = methods.watch("photo");
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {photo && (
        <div className="row-span-2 grid place-items-center">
          <div className="relative h-[80px] w-[80px] md:h-[160px] md:w-[160px]">
            <Image
              src={photo}
              alt="service photo"
              fill={true}
              className="rounded-full object-cover"
            />
          </div>
        </div>
      )}
      <Form.Input
        path="name"
        label="Nombre del proveedor"
        onChange={(e) => {
          methods.setValue(
            "name",
            e.target.value.replace(/[^a-zA-ZñÑ\s]/g, "")
          );
        }}
        required
      />
      <Form.Input path="email" label="Email del proveedor" required />

      {type === "CREATION" ? (
        <Form.Select
          path="types"
          label="Tipo"
          values={ServiceOptions}
          multiple
          required
        />
      ) : (
        <Form.Select
          path="type"
          label="Tipo"
          disabled
          values={ServiceOptions}
          required
        />
      )}

      <Form.ImageUploader path="photo" label="Foto " />
      <div className="md:col-span-2">
        <Form.TextArea
          path="zone"
          label="Zona donde trabaja"
          placeholder="Ej. Plaza San Martin"
          required
        />
      </div>
      <div className="md:col-span-2">
        <Form.TextArea
          path="hour"
          label="Horario"
          placeholder="Ej. De Lunes a Viernes de 12:00hs a 17:00hs"
          required
        />
      </div>
    </div>
  );
}
