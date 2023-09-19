import dayjs from "dayjs";
import React from "react";
import { type BookingRelated } from "~/schemas/bookingSchema";
import { LINKS } from "~/utils/navUtils";
import Link from "../_common/Link";

const titleClassname = "py-3 text-left font-medium text-gray-500";
const detailClassname = "pl-4 text-right font-semibold";

export default function BookingInfo({ booking }: { booking: BookingRelated }) {
  return (
    <table className="w-full">
      <tbody>
        <tr className="border-b-2 border-gray-400">
          <th className={titleClassname}>Negocio:</th>
          <td className="pl-4 font-semibold">
            <Link
              className="ml-auto"
              href={`${LINKS.businesses + "/" + booking.service.business.id}`}
              arrow
              newPage
              active
            >
              {booking.service.business.title}
            </Link>
          </td>
        </tr>
        <tr className="border-b-2 border-gray-400">
          <th className={titleClassname}>Tipo de servicio:</th>
          <td className={detailClassname}>{booking.service.title}</td>
        </tr>
        <tr className="border-b-2 border-gray-400">
          <th className={titleClassname}>Fecha del turno:</th>
          <td className={detailClassname}>
            <span className="capitalize">
              {dayjs(booking.date).format("MMMM D, YYYY")}
            </span>
          </td>
        </tr>
        <tr className="border-b-2 border-gray-400">
          <th className={titleClassname}>Horario:</th>
          <td className={detailClassname}>
            <span className="capitalize">{booking.schedule}</span>
          </td>
        </tr>
        <tr className="border-b-2 border-gray-400">
          <th className={titleClassname}>Estado:</th>
          <td className={detailClassname}>{booking.status}</td>
        </tr>
        <tr className="border-b-2 border-gray-400">
          <th className={titleClassname}>Creacion de la reserva:</th>
          <td className={detailClassname}>
            <span className="capitalize">
              {dayjs(booking.createdAt).format("MMMM D, YYYY - HH:mm")}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
