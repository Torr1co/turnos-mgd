import React, { useState } from "react";
import PetList from "./PetList";
import Title from "~/lib/Typo/Title";
import BookingList from "./BookingList";
import DatePicker from "~/lib/Form/DatePicker";

type FilterProps = {
  start?: Date;
  end?: Date;
};
export default function ClientHome() {
  const [filters, setFilters] = useState<FilterProps>({
    start: undefined,
    end: undefined,
  });
  return (
    <div className="flex flex-col gap-20">
      <section>
        <header className="mb-14 flex items-center justify-between">
          <Title>Mis Consultas</Title>
          <div className="flex gap-4">
            <DatePicker.RangePicker
              onChange={(props) => {
                if (props) {
                  const [start, end] = props;
                  setFilters({
                    start: start?.toDate(),
                    end: end?.toDate(),
                  });
                }
              }}
            />
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
      <section>
        <header className="mb-14 flex items-center justify-between">
          <Title>Mis Perros</Title>
          <div className="flex gap-4"></div>
        </header>
        <PetList />
      </section>
    </div>
  );
}
