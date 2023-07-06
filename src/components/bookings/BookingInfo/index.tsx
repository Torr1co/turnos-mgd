import dayjs from "dayjs";
import React from "react";
import { BookingTypeOptions, TimeZoneOptions } from "~/schemas";
import { type BookingRelated } from "~/schemas/bookingSchema";
import { getOptionLabel } from "~/utils/schemaUtils";
import { useSession } from "next-auth/react";
import { isVet } from "~/utils/schemas/usersUtils";
import { BookingType } from "@prisma/client";

export default function BookingInfo({ booking }: { booking: BookingRelated }) {
  const { data: session } = useSession();
  return (
    <dl className="grid grid-cols-2 gap-4">
      <dt>Fecha:</dt>
      <dd>{dayjs(booking.date).format("MMMM D, YYYY ")}</dd>
      <dt>Tipo de turno:</dt>
      <dd>{getOptionLabel(BookingTypeOptions, booking.type)}</dd>
      {booking.type === BookingType.VACCINE && (
        <>
          <dt>Tipo de vacuna:</dt>
          <dd>{booking.vaccine}</dd>
        </>
      )}
      <dt>Horario:</dt>
      <dd>
        <span className="capitalize">
          {getOptionLabel(TimeZoneOptions, booking.timeZone)}
        </span>
      </dd>

      <dt>Nombre del perro:</dt>
      <dd>
        <span className="capitalize">{booking.dog.name}</span>
      </dd>
      {isVet(session?.user) && (
        <>
          <dt>Nombre del cliente:</dt>
          <dd>
            <span className="capitalize">{booking.user.name}</span>
          </dd>
        </>
      )}
    </dl>
  );
}

