import { type BookingType } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { BookingFilters } from "../BookingActions";
import VetBookingList from "./VetBookingList";
// import BookingList from "./ClientHome/BookingList";
import { useSession } from "next-auth/react";
import dayjs, { type Dayjs } from "dayjs";
import Form from "~/components/_common/Form";

type FilterProps = {
  BookingType?: BookingType;
  pending: boolean;
  rangeDate: [Dayjs, Dayjs] | null;
  text?: string;
};

export default function VetHome() {
  const methods = useForm<{ filters: FilterProps }>({
    defaultValues: {
      filters: {
        pending: false,
        rangeDate: null,
        text: undefined,
        BookingType: undefined,
      },
    },
  });
  const { data: session } = useSession();
  const filters = methods.watch("filters");
  const { data: bookings = [], isLoading } = api.bookings.getAll.useQuery({
    pending: methods.watch("filters.pending"),
  });

  return (
    <div>
      <header className="mb-14 flex items-center justify-between">
        {/* <Title>Turnos {filters.pending ? "Pendientes" : "Pasados"}</Title> */}
        <Form methods={methods} onSubmit={() => undefined}>
          <BookingFilters role={session?.user.role} />
        </Form>
      </header>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <VetBookingList
          bookings={bookings.filter((booking) => {
            const includesText =
              !filters.text ||
              booking.user.email
                .toLowerCase()
                .startsWith(filters.text.toLowerCase()) ||
              booking.user.name
                .toLowerCase()
                .includes(filters.text.toLowerCase());

            const includesDate =
              !filters.rangeDate ||
              (!dayjs(filters.rangeDate[0]).isAfter(booking.date, "d") &&
                !dayjs(booking.date).isAfter(filters.rangeDate[1], "d"));

            const includesType =
              !filters.BookingType || filters.BookingType === booking.type;

            return includesDate && includesText && includesType;
          })}
        />
      )}
    </div>
  );
}
