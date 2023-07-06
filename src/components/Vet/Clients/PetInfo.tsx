import { type Pet } from ".prisma/client";
import dayjs from "dayjs";
import React from "react";
import { GenderOptions } from "~/schemas/petSchema";

export default function PetInfo({ pet }: { pet: Pet }) {
  return (
    <dl className="grid grid-cols-2 gap-4">
      <dt>Nombre:</dt>
      <dd>{pet.name}</dd>
      <dt>Fecha de Nacimiento:</dt>
      <dd>
        {dayjs(pet.birth).format("DD/MM/YYYY")} ({dayjs(pet.birth).toNow(true)})
      </dd>

      <dt>Genero:</dt>
      <dd>
        {GenderOptions.find((gender) => gender.value === pet.gender)?.label}
      </dd>

      <dt>Raza:</dt>
      <dd>{pet.race}</dd>
      <dt>Peso:</dt>
      <dd>{pet.weight}kg</dd>
      <dt>Altura:</dt>
      <dd>{pet.height}cm</dd>
      <dt>Color:</dt>
      <dd>{pet.color}</dd>
      <dt>Se encuentra castrado?:</dt>
      <dd>{pet.castrated ? "Si" : "No"}</dd>
      <hr />
      <dt className="col-span-2">Observaciones:</dt>
      <dd>{pet.observations}</dd>
    </dl>
  );
}
