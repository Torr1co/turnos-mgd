import React from "react";
import Form from "~/components/_common/Form";
import {
  type BookingCreationSchema,
  BookingTypeOptions,
  TimeZoneOptions,
  VaccineOptions,
} from "~/schemas/bookingSchema";
import dayjs from "dayjs";
import { useFormContext } from "react-hook-form";
import { BookingType } from "@prisma/client";

export default function BookingForm() {
  const methods = useFormContext<{ booking: BookingCreationSchema }>();
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
        values={BookingTypeOptions}
        onChange={() => {
          if (methods.watch("booking.type") === BookingType.VACCINE) {
            methods.setValue("booking.vaccineType", VaccineOptions[0].value);
            return;
          }
          methods.setValue("booking.vaccineType", undefined);
        }}
      />
      {methods.watch("booking.type") === BookingType.VACCINE && (
        <Form.Select
          path="booking.vaccineType"
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
