import dayjs from "dayjs";
import React from "react";
import Form from "~/components/_common/Form";
import { useFormContext } from "react-hook-form";
import { type AdoptCreationSchema } from "~/schemas/adoptionSchema";
import { GenderOptions } from "~/schemas/petSchema";

export default function AdoptPublicationForm() {
  const methods = useFormContext<AdoptCreationSchema>();
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="col-span-2 flex flex-col gap-6">
        <Form.Input path="email" label="Email de contacto" required />
        <hr />
      </div>
      <Form.Input
        path="dog.name"
        label="Nombre"
        onChange={(e) => {
          methods.setValue(
            "dog.name",
            e.target.value.replace(/[^a-zA-ZñÑ\s]/g, "")
          );
        }}
      />
      <Form.Date
        path="dog.birth"
        label="Nacimiento (estimado)"
        disabledDate={(current) => {
          return current.isAfter(dayjs(), "d");
        }}
      />
      <Form.Input
        path="dog.race"
        label="Raza"
        onChange={(e) => {
          methods.setValue(
            "dog.race",
            e.target.value.replace(/[^a-zA-ZñÑ\s]/g, "")
          );
        }}
      />
      <Form.Select path="dog.gender" label="Genero" values={GenderOptions} />

      <Form.Number
        path="dog.weight"
        label="Peso (kg)"
        step={0.1}
        onChange={(e) => {
          methods.setValue(
            "dog.weight",
            e.target.value !== ""
              ? +parseFloat(e.target.value.replace(/[^\d.\s]/g, "")).toFixed(2)
              : undefined
          );
        }}
      />
      <Form.Number
        path="dog.height"
        label="Altura (cm)"
        min={0}
        onChange={(e) => {
          methods.setValue(
            "dog.height",
            e.target.value !== ""
              ? +parseFloat(e.target.value.replace(/[^\d.\s]/g, "")).toFixed(2)
              : undefined
          );
        }}
      />
      <Form.Input
        path="dog.color"
        label="Color"
        onChange={(e) => {
          methods.setValue(
            "dog.color",
            e.target.value.replace(/[^a-zA-ZñÑ\s]/g, "")
          );
        }}
      />

      <div className="col-span-2">
        <Form.TextArea path="info" label="Descripcion del perro" />
      </div>
      <div className="col-span-2">
        <Form.TextArea path="reason" label="Razon de la publicacion" />
      </div>
      {/* <Form.Input path="dog.img" label="Foto" type="file" /> */}
    </div>
  );
}
