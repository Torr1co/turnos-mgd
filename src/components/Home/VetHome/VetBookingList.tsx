import React from "react";
import { type Booking, type User, type Pet, BookingType } from "@prisma/client";
import Box from "~/components/_common/Box";
import Text from "~/components/_common/Typo/Text";
import Title from "~/components/_common/Typo/Title";
import { cn } from "~/utils/styleUtils";
import { BookingIcon } from "~/components/_common/icons";
import dayjs from "dayjs";
import { BookingTypeOptions } from "~/schemas/bookingSchema";
import { CancelBooking } from "../BookingActions";
import Link from "next/link";

export default function VetBookingList({
  bookings,
}: {
  bookings: Array<
    Booking & {
      user: User;
      dog: Pet;
    }
  >;
}) {
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {bookings.length === 0 ? (
        <div>No se encontraron turnos</div>
      ) : (
        bookings.map((booking) => {
          return (
            <Link
              key={booking.id}
              href={`/pets/${booking.dog.id}?bookingId=${booking.id}`}
            >
              <li>
                <Box
                  size="lgX"
                  className="flex items-center justify-between bg-white"
                >
                  <div className="items group flex gap-10">
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
                        {
                          BookingTypeOptions.find(
                            (type) => type.value === booking.type
                          )?.label
                        }
                        {booking.type === BookingType.VACCINE && (
                          <span>({booking.vaccine})</span>
                        )}
                      </Title>
                      <Text>
                        Perro:{" "}
                        <span className="capitalize">{booking.dog.name}</span>
                      </Text>
                      <Text>
                        Cliente:{" "}
                        <span className="capitalize">{booking.user.name}</span>
                      </Text>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CancelBooking booking={booking} />
                  </div>
                </Box>
              </li>
            </Link>
          );
        })
      )}
    </ul>
  );
}
