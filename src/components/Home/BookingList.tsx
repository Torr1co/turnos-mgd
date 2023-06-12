import {
  BookingType,
  UserRoles,
  type Booking,
  type Pet,
  type User,
  type BookingStatus,
} from "@prisma/client";
import dayjs from "dayjs";
import React from "react";
import { cn } from "~/utils/styleUtils";
import Box from "../_common/Box";
import { BookingIcon } from "../_common/icons";
import Title from "../_common/Typo/Title";
import { getOptionLabel } from "~/utils/schemaUtils";
import { BookingTypeOptions } from "~/schemas/bookingSchema";
import Text from "../_common/Typo/Text";
import { BookingActions } from "./BookingActions";
import { useSession } from "next-auth/react";

export default function BookingList({
  bookings,
  status,
}: {
  bookings: Array<
    Booking & {
      user: User;
      dog: Pet;
    }
  >;
  status: BookingStatus; // TODO : remove
}) {
  const { data: session } = useSession();
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
                <div className="items group flex items-center gap-10">
                  <BookingIcon />
                  <div>
                    <Title
                      as="h3"
                      size={"text-md font-semibold"}
                      className={cn(
                        "capitalize transition-colors duration-300"
                      )}
                    >
                      {dayjs(booking.date).format("MMMM D, YYYY ")} -{" "}
                      {getOptionLabel(BookingTypeOptions, booking.type)}
                      {booking.type === BookingType.VACCINE && (
                        <span>({booking.vaccine})</span>
                      )}
                    </Title>
                    <Text>
                      Perro:{" "}
                      <span className="capitalize">{booking.dog.name}</span>
                    </Text>
                    {session?.user.role === UserRoles.VET && (
                      <Text>
                        Cliente:{" "}
                        <span className="capitalize">{booking.user.name}</span>
                      </Text>
                    )}
                  </div>
                </div>
                <BookingActions booking={booking} status={status} />
              </Box>
            </li>
          );
        })
      )}
    </ul>
  );
}
