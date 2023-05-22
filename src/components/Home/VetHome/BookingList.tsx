import React, { useState } from "react";
import { type Booking, type User, type Pet } from "@prisma/client";
import Box from "~/lib/Box";
import Text from "~/lib/Typo/Text";
import Title from "~/lib/Typo/Title";
import { cn } from "~/utils/styles";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { BookingIcon } from "~/lib/icons";
import dayjs from "dayjs";
import Tooltip from "~/lib/Tooltip";
import { InquirieOptions } from "~/schemas/booking";
import { InquirieType } from "~/schemas";

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
  const [visible, setVisible] = useState("");
  // const {mutate: }
  return (
    <ul className="grid grid-cols-2 gap-6">
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
                        InquirieOptions.find(
                          (type) => type.value === booking.type
                        )?.label
                      }
                      {booking.type === InquirieType.VACCINE && (
                        <span>({booking.vaccine})</span>
                      )}
                    </Title>
                    <Text>
                      Dueño:{" "}
                      <span className="capitalize">{booking.user.name}</span>
                    </Text>
                    <Text>
                      Fecha: {dayjs(booking.date).format("MMMM D, YYYY ")}
                    </Text>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Tooltip
                    visible={booking.id === visible}
                    onClickOutside={() => setVisible("")}
                    interactive={true}
                    content={
                      <div className="flex flex-col">
                        Estas seguro?
                        <div className="flex gap-2">
                          <button
                            className="hover:text-primary"
                            onClick={() => setVisible("")}
                          >
                            No
                          </button>
                          <button className="hover:text-primary">Si</button>
                        </div>
                      </div>
                    }
                  >
                    <button
                      onClick={() => setVisible(booking.id)}
                      type="button"
                      className=" grid h-12 w-12 items-center rounded-full bg-gray-300 p-2"
                    >
                      <XMarkIcon className="text-gray-600" />
                    </button>
                  </Tooltip>
                </div>
              </Box>
            </li>
          );
        })
      )}
    </ul>
  );
}
