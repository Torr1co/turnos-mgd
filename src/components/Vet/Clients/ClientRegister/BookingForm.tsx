import React from "react";
import Form from "~/lib/Form";

export default function BookingForm() {
  return (
    <div className="grid gap-6">
      <Form.Date path="booking.date" label="Fecha" />
      <Form.Input path="booking.type" label="Tipo" />
      <Form.Input path="booking.timeZone" label="Zona horaria" />
    </div>
  );
}
