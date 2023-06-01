import { type InquirieType } from "@prisma/client";
import dayjs from "dayjs";
import React, { useState } from "react";
import Button from "~/components/_common/Button";
import Dropdown from "~/components/_common/Dropdown";
import CustomDatePicker from "~/components/_common/Form/DatePicker";
import Input from "~/components/_common/Form/Input";
import Select from "~/components/_common/Form/Select";
import Toggle from "~/components/_common/Form/Toggle";
import Title from "~/components/_common/Typo/Title";
import { InquirieOptions } from "~/schemas/bookingSchema";
import { api } from "~/utils/api";
import VetBookingList from "./VetBookingList";
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

  const { data: bookings = [], isLoading } = api.bookings.getAll.useQuery({
    pending: filters.pending,
  });

  return (
    <div>
      <header className="mb-14 flex items-center justify-between">
        <Title>Turnos {filters.pending ? "Pendientes" : "Pasados"}</Title>
        <Dropdown
          label={<Button kind={Button.KINDS.gray}>Opciones</Button>}
          placement={"bottomRight"}
        >
          <div className=" flex min-w-[320px] flex-col gap-4">
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
            <label className="text-base font-medium text-gray-600">
              Filtrar por rango de fechas
            </label>
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
            <label className="text-base font-medium text-gray-600">
              Filtrar por tipo de turno
            </label>
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
            <label className="text-base font-medium text-gray-600">
              Filtrar por nombre de cliente o email
            </label>
            <Input
              value={filters.text}
              placeholder="Buscar por nombre de cliente o email"
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, text: e.target.value }));
              }}
            />
          </div>
        </Dropdown>
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
    </div>
  );
}
