import React from "react";
import { api } from "~/utils/api";
import { BookingUpdateSchema } from "~/schemas/bookingSchema";
import { toast } from "react-hot-toast";
import Title from "~/components/_common/Typo/Title";
import Button from "~/components/_common/Button";
import BookingForm from "~/components/Vet/Clients/ClientRegister/BookingForm";
import Form from "~/components/_common/Form";
import { useModal } from "~/context/ModalContex";
import { useForm } from "~/utils/schemaUtils";
import { type BookingRelated } from "~/schemas/bookingSchema";

type BookingUpdateProps = {
  booking: BookingRelated;
};
export default function BookingUpdateModal({ booking }: BookingUpdateProps) {
  const { handleModal } = useModal();
  const utils = api.useContext();
  const { data: dogs = [] } = api.pets.getAll.useQuery();
  const { mutate: updateBooking, isLoading } = api.bookings.update.useMutation({
    onSuccess: async () => {
      await utils.bookings.getAll.invalidate();
    },
  });
  const methods = useForm<BookingUpdateSchema>({
    schema: BookingUpdateSchema,
    defaultValues: {
      booking: {
        type: booking.type,
        timeZone: booking.timeZone,
        date: booking.date,
        id: booking.id,
        ...(booking.vaccine ? { vaccine: booking.vaccine } : undefined),
      },
      dog: booking.dog.id,
    },
  });

  return (
    <Form
      methods={methods}
      className="flex flex-col gap-6"
      onSubmit={(data) => {
        updateBooking(data, {
          onSuccess: () => {
            toast.success("Turno actualizado!");
            handleModal();
          },
          onError: (err) => toast.error(err.message),
        });
      }}
    >
      <header className="sticky top-10 z-30 -mx-4 flex items-center justify-between bg-white p-4 pb-4">
        <Title as="h4" className="text-gray-500">
          Actualiza el <span className="text-primary">Turno</span>
        </Title>
        <div className="pl-auto">
          <Button type="submit" loading={isLoading} size="sm">
            Actualizar
          </Button>
        </div>
      </header>
      <BookingForm />
      <Form.Select
        label="Perro"
        path="dog"
        values={dogs.map((dog) => ({
          value: dog.id,
          label: dog.name,
        }))}
      />
    </Form>
  );
}
