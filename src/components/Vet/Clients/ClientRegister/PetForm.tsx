import dayjs from "dayjs";
import React from "react";
import Form from "~/lib/Form";
import { GenderOptions, type PetCreation } from "~/schemas/pet";
import { useFormContext } from "react-hook-form";

export default function PetForm() {
  const methods = useFormContext<{ dog: PetCreation }>();
  return (
    <div>
      <div className="flex items-center justify-between"></div>
      <div className="grid grid-cols-2 gap-6">
        <Form.Input
          path="dog.name"
          label="Nombre"
          onChange={(e) => {
            methods.setValue(
              "dog.name",
              e.target.value.replace(/[^a-zA-Z\s]/g, "")
            );
          }}
        />
        <Form.Date
          path="dog.birth"
          label="Nacimiento (estimado)"
          max={dayjs().format("YYYY-MM-DD")}
        />
        <Form.Select path="dog.gender" label="Genero" values={GenderOptions} />
        <Form.Input
          path="dog.race"
          label="Raza"
          onChange={(e) => {
            methods.setValue(
              "dog.race",
              e.target.value.replace(/[^a-zA-Z\s]/g, "")
            );
          }}
        />
        <Form.Number path="dog.weight" label="Peso (kg)" />
        <Form.Number path="dog.height" label="Altura (cm)" />
        <Form.Input
          path="dog.color"
          label="Color"
          onChange={(e) => {
            methods.setValue(
              "dog.name",
              e.target.value.replace(/[^a-zA-Z\s]/g, "")
            );
          }}
        />
        {/* <Form.Input path="dog.img" label="Foto" type="file" /> */}
      </div>
    </div>
  );
}
