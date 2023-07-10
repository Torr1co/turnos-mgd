import React from "react";
import { type BookingRelated } from "~/schemas/bookingSchema";
import { type Castration } from "@prisma/client";
import Title from "~/components/_common/Typo/Title";

export default function CastrationInfo({
  booking,
}: {
  booking: BookingRelated;
}) {
  const castration = booking.castration as Castration;
  return (
    <dl className="grid grid-cols-2 gap-4">
      <Title as="h4" className="col-span-2">
        Informacion de la Castracion
      </Title>
      <dt>Se concreto la castracion ?:</dt>
      <dd>{castration.succesful ? "Si" : "No"}</dd>
    </dl>
  );
}
