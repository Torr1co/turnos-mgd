import dayjs from "dayjs";
import React from "react";
import Form from "~/components/_common/Form";
import { GenderOptions, type PetCreationSchema } from "~/schemas/petSchema";
import { useFormContext } from "react-hook-form";
import Image from "next/image";

export default function PetForm() {
  const methods = useFormContext<{ dog: PetCreationSchema }>();
  const img = methods.watch("dog.img");
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {img && (
        <div className="row-span-2 grid place-items-center">
          <div className="relative h-[80px] w-[80px] md:h-[160px] md:w-[160px]">
            <Image
              src={img}
              alt="pet photo"
              fill={true}
              className="rounded-full object-cover"
            />
          </div>
        </div>
      )}
      <Form.Input
        path="dog.name"
        label="Nombre"
        onChange={(e) => {
          methods.setValue(
            "dog.name",
            e.target.value.replace(/[^a-zA-ZñÑ\s]/g, "")
          );
        }}
        required
      />
      <Form.Date
        path="dog.birth"
        label="Nacimiento (estimado)"
        disabledDate={(current) => {
          return current.isAfter(dayjs(), "d");
        }}
        required
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
        step={0.1}
        label="Peso (kg)"
        onChange={(e) => {
          methods.setValue(
            "dog.weight",
            +parseFloat(e.target.value.replace(/[^\d.\s]/g, "")).toFixed(2)
          );
        }}
        required
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
        required
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

      <div className="md:col-span-2">
        <Form.TextArea path="dog.observations" label="Observaciones" />
      </div>
      <div className="md:col-span-2">
        <Form.Toggle path="dog.castrated" label="Se encuentra castrado?" />
      </div>
    </div>
  );
}
