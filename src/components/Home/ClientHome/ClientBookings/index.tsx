import React, { useState } from "react";
import Title from "~/components/_common/Typo/Title";
import BookingList from "./ClientBookingList";
import DatePicker from "~/components/_common/Form/DatePicker";
import { useModal } from "~/context/ModalContex";
import Button from "~/components/_common/Button";
import BookingCreation from "./BookingCreationModal";
import dayjs from "dayjs";
import { api } from "~/utils/api";

type FilterProps = {
  start?: Date;
  end?: Date;
};

export default function ClientBookings() {
  const { data: bookings = [], isLoading } = api.bookings.getAll.useQuery();
  const [filters, setFilters] = useState<FilterProps>({
    start: undefined,
    end: undefined,
  });
  const { handleModal } = useModal();
  return (
    <section>
      <header className="mb-14 flex items-center justify-between">
        <Title>Mis Turnos</Title>
        <div className="flex gap-4">
          <DatePicker.RangePicker
            disabledDate={(current) => {
              return !current.isAfter(dayjs(), "d");
            }}
            onChange={(props) => {
              if (props) {
                const [start, end] = props;
                setFilters((prev) => ({
                  ...prev,
                  start: start?.toDate(),
                  end: end?.toDate(),
                }));
                return;
              }
              setFilters((prev) => ({
                ...prev,
                start: undefined,
                end: undefined,
              }));
            }}
          />
          <Button
            kind={Button.KINDS.gray}
            onClick={() => handleModal(<BookingCreation />)}
            className="text-base"
          >
            Reservar Turno
          </Button>
        </div>
      </header>
      <div>
        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          <BookingList
            bookings={bookings.filter((booking) => {
              if (!filters.start || !filters.end) return true;
              return (
                !dayjs(filters.start).isAfter(booking.date, "d") &&
                !dayjs(booking.date).isAfter(filters.end, "d")
              );
            })}
          />
        )}
      </div>
    </section>
  );
}
