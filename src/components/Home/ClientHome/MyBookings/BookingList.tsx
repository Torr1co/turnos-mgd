import React, { useState } from "react";
import { type Booking } from "@prisma/client";
import Box from "~/lib/Box";
// import Button from "~/lib/Button";
import Text from "~/lib/Typo/Text";
import Title from "~/lib/Typo/Title";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { BookingIcon } from "~/lib/icons";
import dayjs from "dayjs";
import Tooltip from "~/lib/Tooltip";
import { InquirieOptions } from "~/schemas/booking";
import Button from "~/lib/Button";
import BookingUpdate from "./BookingUpdate";
import { useModal } from "~/context/ModalContex";

export default function ClientBookingList({
  filterFn,
}: {
  filterFn?: (booking: Booking) => boolean;
}) {
  const { data: bookings = [], isLoading } = api.bookings.getAll.useQuery();
  const [visible, setVisible] = useState(false);
  const { handleModal } = useModal();
  if (isLoading) return <div>Cargando...</div>;
  const filteredBookings = filterFn ? bookings.filter(filterFn) : bookings;
  return (
    <ul className="flex flex-col gap-6">
      {filteredBookings.map((booking) => {
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
                    className={cn("capitalize transition-colors duration-300")}
                  >
                    {booking.dog.name} -{" "}
                    {
                      InquirieOptions.find(
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
                <Tooltip
                  visible={visible}
                  onClickOutside={() => setVisible(false)}
                  interactive={true}
                  content={
                    <div className="flex flex-col">
                      Estas seguro?
                      <div className="flex gap-2">
                        <button
                          className="hover:text-primary"
                          onClick={() => setVisible(false)}
                        >
                          No
                        </button>
                        <button className="hover:text-primary">Si</button>
                      </div>
                    </div>
                  }
                >
                  <button
                    onClick={() => setVisible(true)}
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
      })}
    </ul>
  );
}
