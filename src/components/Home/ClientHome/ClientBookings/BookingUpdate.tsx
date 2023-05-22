import React from "react";
import { type Booking, type Pet, type User } from "~/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { type BookingUpdate, BookingUpdateSchema } from "~/schemas/booking";
import { toast } from "react-hot-toast";
import Title from "~/lib/Typo/Title";
import Button from "~/lib/Button";
import BookingForm from "~/components/Vet/Clients/ClientRegister/BookingForm";
import Form from "~/lib/Form";
import { useModal } from "~/context/ModalContex";

type BookingUpdateProps = {
  booking: Booking & {
    user: User;
    dog: Pet;
  };
};
export default function BookingUpdate({ booking }: BookingUpdateProps) {
  const { handleModal } = useModal();
  const utils = api.useContext();
  const { data: dogs = [] } = api.pets.getAll.useQuery();
  const { mutate: updateBooking, isLoading } = api.bookings.update.useMutation({
    onSuccess: async () => {
      await utils.bookings.getAll.invalidate();
    },
  });
  const methods = useForm<BookingUpdate>({
    resolver: zodResolver(BookingUpdateSchema),
    defaultValues: {
      booking: {
        type: booking.type,
        timeZone: booking.timeZone,
        date: booking.date,
        id: booking.id,
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
          onError: () => toast.error("Ha sucedido un error"),
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
