import { type InquirieType } from "@prisma/client";
import dayjs from "dayjs";
import React, { useState } from "react";
import Dropdown from "~/lib/Dropdown";
import CustomDatePicker from "~/lib/Form/DatePicker";
import Input from "~/lib/Form/Input";
import Select from "~/lib/Form/Select";
import Title from "~/lib/Typo/Title";
import { InquirieOptions } from "~/schemas/bookingSchema";
import { api } from "~/utils/api";
import VetBookingList from "./BookingList";
// import BookingList from "./ClientHome/BookingList";

type FilterProps = {
  InquirieType?: InquirieType;
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
    InquirieType: undefined,
  });

  return (
    <div>
      <header className="mb-14 flex items-center justify-between">
        <Title>Turnos Reservados</Title>
        <div className="flex items-center gap-4">
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
          <Dropdown label="Filtros" className="hover:text-primary">
            <div className=" flex min-w-[320px] flex-col gap-4">
              <div className="w-full">
                <Select<InquirieType | undefined>
                  kind="bg-white"
                  value={filters.InquirieType}
                  values={[
                    {
                      value: undefined,
                      label: "Todas",
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
                  Todas las consultas
                </Select>
              </div>

              <Input
                placeholder="Buscar turno"
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
              booking.dog.name
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
