import React from "react";
import { type Booking } from "@prisma/client";
import Box from "~/lib/Box";
import Button from "~/lib/Button";
import Text from "~/lib/Typo/Text";
import Title from "~/lib/Typo/Title";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { BookingIcon } from "~/lib/icons";
import dayjs from "dayjs";

export default function BookingList({
  filterFn,
}: {
  filterFn?: (booking: Booking) => boolean;
}) {
  const { data: bookings = [], isLoading } = api.bookings.getAll.useQuery();

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
                    className={cn(
                      // isSelected && "text-primary",
                      "capitalize transition-colors duration-300"
                    )}
                  >
                    {/* {booking.dog.name} from {booking.user.name} */}
                  </Title>
                  <Text>{dayjs(booking.date).format("MMMM d, YYYY ")}</Text>
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  className="transition-colos duration-200"
                  kind={Button.KINDS.gray}
                >
                  Editar
                </Button>
                <button
                  className=" grid h-12 w-12 items-center rounded-full bg-gray-300 p-2"
                  // onClick={() => {}}
                >
                  <XMarkIcon className="text-gray-600" />
                </button>
              </div>
            </Box>
          </li>
        );
      })}
    </ul>
  );
}
