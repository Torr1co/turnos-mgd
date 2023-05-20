import React from "react";
import Form from "~/lib/Form";
import { InquirieOptions, TimeZoneOptions } from "~/schemas/booking";
import dayjs from "dayjs";

export default function BookingForm() {
  return (
    <div className="grid gap-6">
      <Form.Date
        path="booking.date"
        label="Fecha"
        disabledDate={(current) => {
          return current.isBefore(dayjs(), "d") || current.day() === 6;
        }}
      />
      <Form.Select path="booking.type" label="Tipo" values={InquirieOptions} />
      <Form.Select
        path="booking.timeZone"
        label="Zona horaria"
        values={TimeZoneOptions}
      />
    </div>
  );
}
