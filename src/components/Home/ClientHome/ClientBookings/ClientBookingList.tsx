import React from "react";
import { type Pet, type User, type Booking } from "@prisma/client";
import Box from "~/components/_common/Box";
// import Button from "~/components/_common/Button";
import Text from "~/components/_common/Typo/Text";
import Title from "~/components/_common/Typo/Title";
import { cn } from "~/utils/styleUtils";
import { BookingIcon } from "~/components/_common/icons";
import dayjs from "dayjs";
import { BookingOptions } from "~/schemas/bookingSchema";
import Button from "~/components/_common/Button";
import BookingUpdate from "./BookingUpdateModal";
import { useModal } from "~/context/ModalContex";
import { CancelBooking } from "../../BookingActions";

export default function ClientBookingList({
  bookings,
}: {
  bookings: Array<
    Booking & {
      user: User;
      dog: Pet;
    }
  >;
}) {
  const { handleModal } = useModal();

  return (
    <ul className="flex flex-col gap-6">
      {bookings.length === 0 ? (
        <div>No se encontraron turnos</div>
      ) : (
        bookings.map((booking) => {
          return (
            <li key={booking.id}>
              <Box
                size="lgX"
                className="flex items-center justify-between bg-white"
              >
                <div className="items group flex gap-10">
                  <BookingIcon />
                  <div>
                    <Title
                      as="h3"
                      className={cn(
                        "capitalize transition-colors duration-300"
                      )}
                    >
                      {booking.dog.name} -{" "}
                      {
                        BookingOptions.find(
                          (type) => type.value === booking.type
                        )?.label
                      }
                    </Title>
                    <Text>{dayjs(booking.date).format("MMMM D, YYYY ")}</Text>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    kind={Button.KINDS.gray}
                    onClick={() => {
                      handleModal(<BookingUpdate booking={booking} />);
                    }}
                  >
                    Editar
                  </Button>
                  <CancelBooking booking={booking} />
                </div>
              </Box>
            </li>
          );
        })
      )}
    </ul>
  );
}
