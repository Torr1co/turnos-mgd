import { type Deworming } from "@prisma/client";
import React from "react";
import Title from "~/components/_common/Typo/Title";
import { type BookingRelated } from "~/schemas/bookingSchema";

export default function DewormingInfo({
  booking,
}: {
  booking: BookingRelated;
}) {
  const deworming = booking.deworming as Deworming;
  return (
    <dl className="grid grid-cols-2 gap-4">
      <Title as="h4" className="col-span-2">
        Informacion de la desparasitacion
      </Title>
      <dt>Producto : </dt>
      <dd>{deworming.product}</dd>
      <dt>Dosis Aplicada: </dt>
      <dd>{deworming.dosis}</dd>
    </dl>
  );
}
