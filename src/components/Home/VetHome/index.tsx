import React, { useState } from "react";
import CustomDatePicker from "~/lib/Form/DatePicker";
import Input from "~/lib/Form/Input";
import Title from "~/lib/Typo/Title";
import { api } from "~/utils/api";
import VetBookingList from "./BookingList";
// import BookingList from "./ClientHome/BookingList";

type FilterProps = {
  start?: Date;
  end?: Date;
  text?: string;
};

export default function VetHome() {
  const { data: bookings = [], isLoading } = api.bookings.getAll.useQuery();

  const [filters, setFilters] = useState<FilterProps>({
    start: undefined,
    end: undefined,
    text: undefined,
  });

  return (
    <div>
      <header className="mb-14 flex items-center justify-between">
        <Title>Turnos Reservados</Title>
        <div className="flex gap-4">
          {/* <Input
            placeholder="Buscar turno"
            onChange={(e) => {
              setfilter(e.target.value);
            }}
          /> */}
          <Input
            placeholder="Buscar turno"
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, text: e.target.value }));
            }}
          />
          <CustomDatePicker.RangePicker
            onChange={(props) => {
              if (props) {
                const [start, end] = props;
                setFilters((prev) => ({
                  ...prev,
                  start: start?.toDate(),
                  end: end?.toDate(),
                }));
              }
              setFilters((prev) => ({
                ...prev,
                start: undefined,
                end: undefined,
              }));
            }}
          />
        </div>
      </header>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <VetBookingList
          bookings={bookings.filter((booking) => {
            const includesText =
              !filters.text ||
              booking.dog.name.toLowerCase().includes(filters.text) ||
              booking.user.name.toLowerCase().includes(filters.text);

            const includesDate =
              !filters.start ||
              !filters.end ||
              (filters.start < booking.date && booking.date < filters.end);
            return includesDate && includesText;
          })}
        />
      )}
      {/* <BookingList /> */}
      {/* <ClientList
        filterFn={(user) =>
          user.email.toLowerCase().includes(filter.toLowerCase()) ||
          user.name.toLowerCase().includes(filter.toLowerCase())
        }
      /> */}
    </div>
  );
}
