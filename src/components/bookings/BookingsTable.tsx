import dayjs from "dayjs";
import React from "react";
import { cn } from "~/utils/styleUtils";
import Text from "../_common/Typo/Text";
// import { useSession } from "next-auth/react";
import { type BookingRelated } from "~/schemas/bookingSchema";
import Link from "../_common/Link";
import { LINKS } from "~/utils/navUtils";
import { type FC } from "~/utils/language/types";

const Td = ({
  children,
  className,
  index = 0,
}: FC<{
  index?: number;
}>) => {
  return (
    <td
      className={cn(
        className,
        "border-x border-gray-400 p-3",
        index % 2 == 0 && "bg-gray-200"
      )}
    >
      {children}
    </td>
  );
};

const Th = ({ children, className }: FC) => {
  return (
    <th className={cn("border border-gray-400 p-3", className)}>{children}</th>
  );
};

const BookingItem = ({
  booking,
  index = 0,
  mine = false,
}: {
  booking: BookingRelated;
  index?: number;
  mine: boolean;
}) => {
  // const { data: session } = useSession();
  // const isPaid = booking.payment?.status === "paid";

  return (
    <tr
      className={
        cn()
        // "flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        // isCancelled && "bg-gray-50"
      }
    >
      <Td index={index}>
        <Text>{dayjs(booking.date).format("DD/MM/YYYY")}</Text>
      </Td>
      <Td index={index}>
        <Text>{booking.schedule}</Text>
      </Td>
      {!mine && (
        <Td index={index}>
          <Text className="truncate">
            {booking.user
              ? `${booking.user.firstname} ${booking.user.lastname}`
              : booking.username}
          </Text>
        </Td>
      )}
      <Td index={index} className="hidden md:table-cell">
        <Text>{booking.payment?.amount ?? 0}</Text>
      </Td>
      <Td index={index} className="hidden md:table-cell">
        <Text>
          {booking.service.price || "Gratis"}{" "}
          {/*TODO booking.payment?.totalAmount */}
        </Text>
      </Td>
      <Td index={index}>
        <Text>{booking.service.business.title}</Text>
      </Td>
      <Td index={index}>
        <Text>{booking.service.title}</Text>
      </Td>

      <Td index={index} className="hidden md:table-cell">
        <Text>{booking.status}</Text>
      </Td>
      <Td index={index}>
        <Link href={LINKS.bookings + "/" + booking.id} arrow active>
          Ver mas
        </Link>
      </Td>
      {/* <Td className="flex flex-col">
        <Text>{getOptionLabel(BookingStatus, booking.status)}</Text>
      </Td> */}
    </tr>
  );
};

export default function BookingsTable({
  bookings,
  mine = false,
}: {
  bookings: BookingRelated[];
  mine?: boolean;
}) {
  return bookings.length === 0 ? (
    <div>No se encontraron turnos</div>
  ) : (
    <table className="w-full">
      <thead className="h-20">
        <tr className=" bg-primary text-white">
          <Th>Fecha</Th>
          <Th>Turno</Th>
          {!mine && <Th>Usuario</Th>}
          <Th className="hidden md:table-cell">Monto pagado</Th>
          <Th className="hidden md:table-cell">Monto total</Th>
          <Th>Negocio</Th>
          <Th>Servicio</Th>
          <Th className="hidden md:table-cell">Estado</Th>
          <Th>Acciones</Th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking, i) => {
          return (
            <BookingItem
              mine={mine}
              key={booking.id}
              booking={booking}
              index={i}
            />
          );
        })}
      </tbody>
    </table>
  );
}
