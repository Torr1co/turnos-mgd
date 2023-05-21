import React, { useState } from "react";
import Title from "~/lib/Typo/Title";
import BookingList from "./BookingList";
import DatePicker from "~/lib/Form/DatePicker";
import { useModal } from "~/context/ModalContex";
import Button from "~/lib/Button";
import BookingCreation from "./BookingCreation";

type FilterProps = {
  start?: Date;
  end?: Date;
};

export default function MyBookings() {
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
            onChange={(props) => {
              if (props) {
                const [start, end] = props;
                setFilters((prev) => ({
                  ...prev,
                  start: start?.toDate(),
                  end: end?.toDate(),
                }));
              }
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
        <BookingList
          filterFn={(booking) => {
            if (!filters.start || !filters.end) return true;
            return filters.start < booking.date && booking.date < filters.end;
          }}
        />
      </div>
    </section>
  );
}
