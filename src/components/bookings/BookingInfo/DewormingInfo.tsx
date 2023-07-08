
import { type Deworming } from "@prisma/client";
import React from "react";
import { type BookingRelated } from "~/schemas/bookingSchema";

export default function DewormingInfo({
  booking,
}: {
  booking: BookingRelated;
}) {
  const deworming = booking.deworming as Deworming;
  return (
    <dl className="grid grid-cols-2 gap-4">
      <dt>Peso: </dt>
      <dd>{booking.weight}</dd>
      <dt>Producto : </dt>
      <dd>{deworming ? deworming.product : ""}</dd>
      <dt>Dosis Aplicada: </dt>
      <dd>{deworming ? deworming.dosis : ""}</dd>
    </dl>
  );
}