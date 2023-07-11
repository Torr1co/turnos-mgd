import { BookingType, BookingStatus } from "@prisma/client";
import dayjs from "dayjs";
import React from "react";
import { cn } from "~/utils/styleUtils";
import Box from "../_common/Box";
import { BookingCancelledIcon, BookingIcon } from "../_common/icons";
import Title from "../_common/Typo/Title";
import { getOptionLabel } from "~/utils/schemaUtils";
import { BookingTypeOptions, TimeZoneOptions } from "~/schemas/bookingSchema";
import Text from "../_common/Typo/Text";
import { BookingActions } from "./BookingActions";
import { useSession } from "next-auth/react";
import { type BookingRelated } from "~/schemas/bookingSchema";
import { isVet } from "~/utils/schemas/usersUtils";

const BookingItem = ({ booking }: { booking: BookingRelated }) => {
  const { data: session } = useSession();
  return (
    <div className="items group flex items-center gap-10">
      {booking.status === BookingStatus.CANCELLED ? (
        <BookingCancelledIcon />
      ) : (
        <BookingIcon />
      )}
      <div>
        <Title
          as="h3"
          size={"text-md font-semibold"}
          className={cn(
            "capitalize transition-colors duration-300",
            booking.status === BookingStatus.CANCELLED && "text-red-500"
          )}
        >
          {dayjs(booking.date).format("MMMM D, YYYY ")} -{" "}
          {getOptionLabel(
            [
              ...BookingTypeOptions,
              {
                label: "Urgencia",
                value: BookingType.URGENCY,
              },
            ],
            booking.type
          )}
          {booking.type === BookingType.VACCINE && (
            <span>({booking.vaccineType})</span>
          )}
        </Title>
        <Text>
          Horario:{" "}
          <span className="capitalize">
            {getOptionLabel(TimeZoneOptions, booking.timeZone)}
          </span>
        </Text>
        {booking.dog && (
          <Text>
            Perro: <span className="capitalize">{booking.dog.name}</span>
          </Text>
        )}
        {isVet(session?.user) && (
          <Text>
            Cliente:{" "}
            <span className="capitalize">
              {booking.user
                ? `${booking.user.name} ${booking.user.lastname}`
                : "Anonimo"}
            </span>
          </Text>
        )}
      </div>
    </div>
  );
};

export default function BookingList({
  bookings,
}: {
  bookings: BookingRelated[];
}) {
  return (
    <ul className="flex flex-col gap-6">
      {bookings.length === 0 ? (
        <div>No se encontraron turnos</div>
      ) : (
        bookings.map((booking) => {
          return (
            <li key={booking.id}>
              <Box
                size="md"
                className="flex items-center justify-between bg-white"
              >
                <BookingItem booking={booking} />
                <BookingActions booking={booking} />
              </Box>
            </li>
          );
        })
      )}
    </ul>
  );
}
