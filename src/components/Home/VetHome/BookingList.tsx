import React, { useState } from "react";
import {
  type Booking,
  type User,
  type Pet,
  InquirieType,
} from "@prisma/client";
import Box from "~/lib/Box";
import Text from "~/lib/Typo/Text";
import Title from "~/lib/Typo/Title";
import { cn } from "~/utils/styles";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { BookingIcon } from "~/lib/icons";
import dayjs from "dayjs";
import Tooltip from "~/lib/Tooltip";
import { InquirieOptions } from "~/schemas/bookingSchema";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

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
  const utils = api.useContext();
  const { mutate: cancelBooking } = api.bookings.cancel.useMutation({
    onSuccess: async () => {
      await utils.bookings.getAll.invalidate();
    },
  });
  return (
    <ul className="grid gap-6 md:grid-cols-2">
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
                      size={"text-md font-semibold"}
                      className={cn(
                        "capitalize transition-colors duration-300"
                      )}
                    >
                      {dayjs(booking.date).format("MMMM D, YYYY ")} -{" "}
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
                          <button
                            className="hover:text-primary"
                            onClick={() => {
                              cancelBooking(booking.id, {
                                onSuccess: () => {
                                  setVisible("");
                                  toast.success("Turno cancelado con exito");
                                },
                                onError: () => {
                                  toast.error("Ha sucedido un error");
                                },
                              });
                            }}
                          >
                            Si
                          </button>
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
