import React from "react";
import CustomDatePicker from "~/lib/Form/DatePicker";
import Title from "~/lib/Typo/Title";
import BookingList from "./BookingList";

export default function VetHome() {
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
          <CustomDatePicker.RangePicker />
        </div>
      </header>
      <BookingList />
      {/* <ClientList
        filterFn={(user) =>
          user.email.toLowerCase().includes(filter.toLowerCase()) ||
          user.name.toLowerCase().includes(filter.toLowerCase())
        }
      /> */}
    </div>
  );
}
