import { type InquirieType } from "@prisma/client";
import dayjs from "dayjs";
import React, { useState } from "react";
import Dropdown from "~/lib/Dropdown";
import CustomDatePicker from "~/lib/Form/DatePicker";
import Input from "~/lib/Form/Input";
import Select from "~/lib/Form/Select";
import Toggle from "~/lib/Form/Toggle";
import Title from "~/lib/Typo/Title";
import { InquirieOptions } from "~/schemas/bookingSchema";
import { api } from "~/utils/api";
import VetBookingList from "./BookingList";
// import BookingList from "./ClientHome/BookingList";

type FilterProps = {
  InquirieType?: InquirieType;
  pending: boolean;
  start?: Date;
  end?: Date;
  text?: string;
};

export default function VetHome() {
  const [filters, setFilters] = useState<FilterProps>({
    pending: false,
    start: undefined,
    end: undefined,
    text: undefined,
    InquirieType: undefined,
  });

  const { data: bookings = [], isLoading } = api.bookings.getAll.useQuery(
    filters.pending
  );

  return (
    <div>
      <header className="mb-14 flex items-center justify-between">
        <Title>Turnos</Title>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Toggle
            label="Turnos Pendientes"
            checked={filters.pending}
            onChange={() =>
              setFilters((prev) => ({
                ...prev,
                pending: !prev.pending,
              }))
            }
          />

          <Dropdown label="Filtros" className="hover:text-primary">
            <div className=" flex min-w-[320px] flex-col gap-4">
              <CustomDatePicker.RangePicker
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
              <div className="w-full">
                <Select<InquirieType | undefined>
                  kind="bg-white"
                  value={filters.InquirieType}
                  values={[
                    {
                      value: undefined,
                      label: "Todos",
                    },
                    ...InquirieOptions,
                  ]}
                  onChange={(selected) => {
                    setFilters((prev) => ({
                      ...prev,
                      InquirieType: selected,
                    }));
                  }}
                >
                  Todos los Turnos
                </Select>
              </div>

              <Input
                value={filters.text}
                placeholder="Buscar por nombre de cliente o email"
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, text: e.target.value }));
                }}
              />
            </div>
          </Dropdown>
        </div>
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
                .includes(filters.text.toLowerCase()) ||
              booking.user.name
                .toLowerCase()
                .includes(filters.text.toLowerCase());

            const includesDate =
              !filters.start ||
              !filters.end ||
              (!dayjs(filters.start).isAfter(booking.date, "d") &&
                !dayjs(booking.date).isAfter(filters.end, "d"));

            const includesType =
              !filters.InquirieType || filters.InquirieType === booking.type;

            return includesDate && includesText && includesType;
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
