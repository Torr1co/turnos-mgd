import React from "react";
import Form from "~/lib/Form";
import {
  type BookingCreation,
  InquirieOptions,
  TimeZoneOptions,
  VaccineOptions,
} from "~/schemas/bookingSchema";
import dayjs from "dayjs";
import { useFormContext } from "react-hook-form";
import { InquirieType } from "@prisma/client";

export default function BookingForm() {
  const methods = useFormContext<{ booking: BookingCreation }>();
  return (
    <div className="grid gap-6">
      <Form.Date
        path="booking.date"
        label="Fecha"
        disabledDate={(current) => {
          return !current.isAfter(dayjs(), "d") || current.day() === 0;
        }}
        required
      />
      <Form.Select
        path="booking.type"
        label="Tipo"
        values={InquirieOptions}
        onChange={() => {
          if (methods.watch("booking.type") === InquirieType.VACCINE) {
            methods.setValue("booking.vaccine", VaccineOptions[0].value);
            return;
          }
          methods.setValue("booking.vaccine", undefined);
        }}
      />
      {methods.watch("booking.type") === InquirieType.VACCINE && (
        <Form.Select
          path="booking.vaccine"
          label="Tipo de vacuna"
          values={VaccineOptions}
        />
      )}
      <Form.Select
        path="booking.timeZone"
        label="Zona horaria"
        values={TimeZoneOptions}
      />
    </div>
  );
}
