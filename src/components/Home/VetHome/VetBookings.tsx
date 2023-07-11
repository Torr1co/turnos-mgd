import { type BookingType, BookingStatus } from "@prisma/client";
import dayjs from "dayjs";
import React from "react";
import { useForm } from "react-hook-form";
import Form from "~/components/_common/Form";
import { FieldSelectHeader } from "~/components/_common/Form/Select";
import { BookingStatusOptions } from "~/schemas/bookingSchema";
import { api } from "~/utils/api";
import { BookingFilters, RegisterUrgency } from "../../bookings/BookingActions";
import BookingList from "../../bookings/BookingList";

type FilterProps = {
  bookingStatus: BookingStatus;
  bookingType: BookingType | null;
  pending: boolean;
  rangeDate?: [Date, Date];
  text?: string;
};

export default function VetBookings() {
  const methods = useForm<{ filters: FilterProps }>({
    defaultValues: {
      filters: {
        bookingStatus: BookingStatus.APPROVED,
        pending: true,
        rangeDate: undefined,
        text: undefined,
        bookingType: null,
      },
    },
  });
  const filters = methods.watch("filters");
  const { data: bookings = [], isLoading } = api.bookings.getAll.useQuery({
    status: filters.bookingStatus,
  });

  return (
    <div>
      <Form methods={methods}>
        <header className="mb-14 flex items-center justify-between">
          {/* <Title>Turnos {filters.pending ? "Pendientes" : "Pasados"}</Title> */}
          <FieldSelectHeader
            values={BookingStatusOptions}
            path="filters.bookingStatus"
          />
          <div className="flex items-center gap-4">
            <RegisterUrgency />
            <BookingFilters />
          </div>
        </header>
      </Form>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <BookingList
          bookings={bookings.filter((booking) => {
            const includesText =
              !filters.text ||
              !!(
                booking.user?.email
                  .toLowerCase()
                  .startsWith(filters.text.toLowerCase()) ??
                booking.user?.name
                  .toLowerCase()
                  .includes(filters.text.toLowerCase())
              );

            const includesDate =
              !filters.rangeDate ||
              (!dayjs(filters.rangeDate[0]).isAfter(booking.date, "d") &&
                !dayjs(booking.date).isAfter(filters.rangeDate[1], "d"));

            const includesType =
              !filters.bookingType || filters.bookingType === booking.type;

            return includesDate && includesText && includesType;
          })}
        />
      )}
    </div>
  );
}
