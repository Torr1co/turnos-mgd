import React from "react";
import Form from "~/lib/Form";

export default function PetForm() {
  return (
    <div>
      <div className="flex items-center justify-between"></div>
      <div className="grid grid-cols-2 gap-6">
        <Form.Input path="dog.name" label="Nombre" />
        <Form.Number path="dog.age" label="Edad estimada ()" />
        <Form.Input path="dog.gender" label="Genero" />
        <Form.Input path="dog.img" label="Foto" />
        <Form.Input path="dog.color" label="Color" />
        <Form.Number path="dog.weight" label="Altura (cm)" />
        <Form.Input path="dog.race" label="Raza" />
      </div>
    </div>
  );
}
