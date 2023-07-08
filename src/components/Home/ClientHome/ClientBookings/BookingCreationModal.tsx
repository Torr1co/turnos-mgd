import React from "react";
import { api } from "~/utils/api";
import { BookingCreationSchema as CreationSchema } from "~/schemas/bookingSchema";
import { toast } from "react-hot-toast";
import Title from "~/components/_common/Typo/Title";
import Button from "~/components/_common/Button";
import BookingForm from "~/components/Vet/Clients/ClientRegister/BookingForm";
import Form from "~/components/_common/Form";
import { useModal } from "~/context/ModalContex";
import { z } from "zod";
import { TimeZone, BookingType } from "@prisma/client";
import dayjs from "dayjs";
import { useForm } from "~/utils/schemaUtils";

const BookingCreationSchema = z.object({ booking: CreationSchema });
type BookingCreationSchema = z.infer<typeof BookingCreationSchema>;

export default function BookingCreationModal() {
  const { handleModal } = useModal();
  const utils = api.useContext();
  const { data: dogs = [] } = api.pets.getAll.useQuery();
  const { mutate: updateBooking, isLoading } = api.bookings.create.useMutation({
    onSuccess: async () => {
      await utils.bookings.getAll.invalidate();
    },
  });
  const methods = useForm<BookingCreationSchema>({
    schema: BookingCreationSchema,
    defaultValues: {
      booking: {
        timeZone: TimeZone.MORNING,
        type: BookingType.GENERAL,
        date: dayjs().add(1, "d").toDate(),
      },
    },
  });

  return (
    <Form
      methods={methods}
      className="flex flex-col gap-6"
      onSubmit={(data) => {
        updateBooking(data.booking, {
          onSuccess: () => {
            toast.success("Turno creado con exito!");
            handleModal();
          },
          onError: (err) => toast.error(err.message),
        });
      }}
    >
      <header className="sticky top-10 z-30 -mx-4 flex items-center justify-between bg-white p-4 pb-4">
        <Title as="h4" className="text-gray-500">
          Solicita un <span className="text-primary">Turno</span>
        </Title>
        <div className="pl-auto">
          <Button type="submit" loading={isLoading} size="sm">
            Solicitar
          </Button>
        </div>
      </header>
      <BookingForm />
      <Form.Select
        label="Perro"
        path="booking.dog"
        values={dogs
          .filter((dog) => !dog.disabled)
          .map((dog) => ({
            value: dog.id,
            label: dog.name,
          }))}
        required
      />
    </Form>
  );
}
