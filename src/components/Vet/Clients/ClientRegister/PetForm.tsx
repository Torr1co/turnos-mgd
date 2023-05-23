import dayjs from "dayjs";
import React from "react";
import Form from "~/lib/Form";
import { GenderOptions, type PetCreationSchema } from "~/schemas/petSchema";
import { useFormContext } from "react-hook-form";

export default function PetForm() {
  const methods = useFormContext<{ dog: PetCreationSchema }>();
  return (
    <div className="grid grid-cols-2 gap-6">
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
      <Form.Select path="dog.gender" label="Genero" values={GenderOptions} />
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
      <Form.Number
        path="dog.weight"
        label="Peso (kg)"
        onChange={(e) => {
          methods.setValue(
            "dog.weight",
            +parseFloat(e.target.value.replace(/[^\d.\s]/g, "")).toFixed(2)
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
            +parseFloat(e.target.value.replace(/[^\d.\s]/g, "")).toFixed(2)
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

      <Form.ImageUploader path="dog.img" label="Imagen" />

      <div className="col-span-2">
        <Form.TextArea path="dog.observations" label="Observaciones" />
      </div>
      <div className="col-span-2">
        <Form.Toggle path="dog.castrated" label="Se encuentra castrado?" />
      </div>
      {/* <Form.Input path="dog.img" label="Foto" type="file" /> */}
    </div>
  );
}
