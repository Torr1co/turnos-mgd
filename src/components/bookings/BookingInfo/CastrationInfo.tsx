import React from "react";
import { type BookingRelated } from "~/schemas/bookingSchema";
import { type Castration } from "@prisma/client";

export default function CastrationInfo({
  booking,
}: {
  booking: BookingRelated;
}) {
  const castration = booking.castration as Castration;
  return (
    <dl className="grid grid-cols-2 gap-4">
      <dt>Se concreto la castracion ?:</dt>
      <dd>{castration.succesful ?'Si' : 'No'}</dd>
      <dt> Peso :</dt>
      <dd>{booking.weight }</dd>
    </dl>
  );
}
