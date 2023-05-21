import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { BookingCreationSchema as CreationSchema } from "~/schemas/booking";
import { toast } from "react-hot-toast";
import Title from "~/lib/Typo/Title";
import Button from "~/lib/Button";
import BookingForm from "~/components/Vet/Clients/ClientRegister/BookingForm";
import Form from "~/lib/Form";
import { useModal } from "~/context/ModalContex";
import { z } from "zod";
import { TimeZone, InquirieType } from "@prisma/client";

const BookingCreationSchema = z.object({ booking: CreationSchema });
type BookingCreation = z.infer<typeof BookingCreationSchema>;

export default function BookingCreation() {
  const { handleModal } = useModal();
  const utils = api.useContext();
  const { data: dogs = [] } = api.pets.getAll.useQuery();
  const { mutate: updateBooking, isLoading } = api.bookings.create.useMutation({
    onSuccess: async () => {
      await utils.bookings.getAll.invalidate();
    },
  });
  const methods = useForm<BookingCreation>({
    resolver: zodResolver(BookingCreationSchema),
    defaultValues: {
      booking: {
        timeZone: TimeZone.MORNING,
        type: InquirieType.VACCINE,
        date: new Date(),
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
          onError: () => toast.error("Ha sucedido un error"),
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
        values={dogs.map((dog) => ({
          value: dog.id,
          label: dog.name,
        }))}
      />
    </Form>
  );
}
