import React from "react";
import Form from "~/components/_common/Form";
import { type StartBookingSchema } from "~/schemas/bookingSchema";
import dayjs from "dayjs";
import { useFormContext } from "react-hook-form";
import { type BusinessRelated } from "~/schemas/businessSchema";
import { useSession } from "next-auth/react";

export default function BookingForm({
  business,
}: {
  business: BusinessRelated;
}) {
  const methods = useFormContext<Partial<StartBookingSchema>>();
  const selectedService = business.services.find(
    (s) => s.id === methods.watch("serviceId")
  );
  const selectedDate = methods.watch("date");
  const { data: session } = useSession();
  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        {!session && (
          <Form.Input path="username" label="Nombre de usuario" required />
        )}
        <Form.Select
          path="serviceId"
          label="Servicio a reservar"
          values={business.services.map((service) => {
            return {
              label: `${service.title} - ${
                service.price === 0 ? "Gratis" : "$" + service.price.toString()
              }`,
              value: service.id,
            };
          })}
          onChange={(serviceId) => {
            const selectedService = business.services.find(
              (s) => s.id === serviceId
            );
            if (selectedService) {
              methods.setValue("payment.amount", selectedService.price / 10);
              methods.clearErrors();
            }
          }}
        />
        <Form.Date
          path="date"
          label="Fecha"
          disabledDate={(current) => {
            return (
              !business.days[dayjs(current).day()] ||
              current.isBefore(dayjs(), "day")
            );
          }}
          onChange={() => {
            methods.setValue("schedule", undefined);
          }}
          required
        />
        {selectedService && selectedDate && (
          <Form.Select
            path="schedule"
            label="Horario a reservar"
            values={business.schedule.map((schedule) => {
              return {
                disabled: selectedService.bookings.some(
                  (booking) =>
                    dayjs(booking.date).isSame(selectedDate, "day") &&
                    booking.schedule === schedule
                ),
                label: schedule,
                value: schedule,
              };
            })}
          />
        )}

        {selectedService &&
          selectedDate &&
          methods.watch("schedule") &&
          (selectedService.price === 0 ? (
            <div className="col-span-2">
              La reserva de este turno es gratuita
            </div>
          ) : (
            <Form.Number
              path="payment.amount"
              label={`Pago a realizar`}
              required
            />
          ))}
      </div>
    </div>
  );
}
