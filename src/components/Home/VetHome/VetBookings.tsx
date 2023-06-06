import { type BookingType } from "@prisma/client";
import dayjs from "dayjs";
import React from "react";
import { useForm } from "react-hook-form";
import Form from "~/components/_common/Form";
import Title from "~/components/_common/Typo/Title";
import { api } from "~/utils/api";
import { VetBookingFilters } from "../BookingActions";
import VetBookingList from "./VetBookingList";

type FilterProps = {
  inquirieType: BookingType | null;
  pending: boolean;
  dateRange?: [Date, Date];
  text?: string;
};

export default function VetBookings() {
  const methods = useForm<FilterProps>({
    defaultValues: {
      pending: true,
      dateRange: undefined,
      text: undefined,
      inquirieType: null,
    },
  });
  const filters = methods.watch();
  const { data: bookings = [], isLoading } = api.bookings.getAll.useQuery({
    pending: filters.pending,
  });

  return (
    <div>
      <header className="mb-14 flex items-center justify-between">
        <Title>Turnos {filters.pending ? "Pendientes" : "Pasados"}</Title>

        <Form methods={methods}>
          <VetBookingFilters />
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
              !filters.dateRange ||
              (!dayjs(filters.dateRange[0]).isAfter(booking.date, "d") &&
                !dayjs(booking.date).isAfter(filters.dateRange[1], "d"));

            const includesType =
              !filters.inquirieType || filters.inquirieType === booking.type;

            return includesDate && includesText && includesType;
          })}
        />
      )}
    </div>
  );
}
