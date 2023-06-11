import React from "react";
import { type AdoptPublication, type Dog } from "@prisma/client";
import { AdoptItem } from "../AdoptionList";
import dayjs from "dayjs";
import ContactModal from "~/components/Contact/ContactModal";
import { AdoptionContactData } from "~/utils/schemas/adoptionUtils";
import { getOptionLabel } from "~/utils/schemaUtils";
import { GenderOptions } from "~/schemas/petSchema";

export default function AdoptContactModal({
  adoption,
}: {
  adoption: AdoptPublication & { dog: Dog };
}) {
  return (
    <ContactModal
      to={adoption.email}
      subject={AdoptionContactData.SUBJECT}
      reason={AdoptionContactData.REASON}
    >
      <section className="flex flex-col gap-12">
        <AdoptItem adoption={adoption} truncate={false} />
        <dl className="grid grid-cols-2 gap-4 text-base">
          {adoption.dog.birth && (
            <>
              <dt>Edad:</dt>
              <dd className="text-gray-500">
                {dayjs(adoption.dog.birth).toNow(true)} (
                {dayjs(adoption.dog.birth).format("DD/MM/YYYY")})
              </dd>
            </>
          )}
          {adoption.dog.gender && (
            <>
              <dt>Genero:</dt>
              <dd className="text-gray-500">
                {getOptionLabel(GenderOptions, adoption.dog.gender)}
              </dd>
            </>
          )}
          {adoption.dog.race && (
            <>
              <dt>Raza:</dt>

              <dd className="text-gray-500">{adoption.dog.race}</dd>
            </>
          )}
          {!!adoption.dog.weight && (
            <>
              <dt>Peso:</dt>

              <dd className="text-gray-500">{adoption.dog.weight}kg</dd>
            </>
          )}
          {!!adoption.dog.height && (
            <>
              <dt>Altura:</dt>

              <dd className="text-gray-500">{adoption.dog.height}cm</dd>
            </>
          )}
          {adoption.dog.color && (
            <>
              <dt>Color:</dt>

              <dd className="text-gray-500">{adoption.dog.color}</dd>
            </>
          )}
        </dl>
      </section>
    </ContactModal>
  );
}
