import { type Vaccine } from "@prisma/client";
import React from "react";
import Title from "~/components/_common/Typo/Title";
import { type BookingRelated } from "~/schemas/bookingSchema";

export default function VaccineInfo({ booking }: { booking: BookingRelated }) {
  const vaccine = booking.vaccine as Vaccine;
  return (
    <dl className="grid grid-cols-2 gap-4">
      <Title as="h4" className="col-span-2">
        Informacion de la Vacunacion
      </Title>
      <dt>Tipo: </dt>
      <dd>{booking.vaccineType}</dd>
      <dt>Dosis Aplicada : </dt>
      <dd>{vaccine.dosis}</dd>
    </dl>
  );
}
