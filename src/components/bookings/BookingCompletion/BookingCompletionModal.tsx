import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Title from "~/components/_common/Typo/Title";
import Button from "~/components/_common/Button";
import Form from "~/components/_common/Form";
import { useModal } from "~/context/ModalContex";
import { type BookingRelated } from "~/schemas/bookingSchema";
import { BookingType } from "@prisma/client";
import { BookingCompletionSchema, BookingTypeOptions } from "~/schemas";
import CastrationCompletionForm from "./CastrationCompletionForm";
import { getOptionLabel } from "~/utils/schemaUtils";
import GeneralCompletionForm from "./GeneralCompletionForm";

const BookingTypeConvertion = {
  [BookingType.CASTRATION]: CastrationCompletionForm,
  [BookingType.DEWORMING]: CastrationCompletionForm,
  [BookingType.GENERAL]: GeneralCompletionForm,
  [BookingType.VACCINE]: CastrationCompletionForm,
  [BookingType.URGENCY]: CastrationCompletionForm,
} as const;

export default function BookingCompletionModal({
  booking,
}: {
  booking: BookingRelated;
}) {
  const { handleModal } = useModal();
  const BookingTypeForm = BookingTypeConvertion[booking.type];
  const utils = api.useContext();
  const { mutate: completeBooking, isLoading } =
    api.bookings.complete.useMutation({
      onSuccess: async () => {
        await utils.bookings.getAll.invalidate();
      },
    });
  const methods = useForm<BookingCompletionSchema>({
    resolver: zodResolver(BookingCompletionSchema),
    defaultValues: {
      bookingId: booking.id,
    },
  });

  return (
    <Form
      methods={methods}
      className="flex flex-col gap-6"
      onSubmit={(data) => {
        completeBooking(data, {
          onSuccess: () => {
            toast.success("Turno completado con exito");
            handleModal();
          },
          onError: () => toast.error("Ha sucedido un error"),
        });
      }}
    >
      <header className="sticky top-10 z-30 -mx-4 flex items-center justify-between bg-white p-4 pb-4">
        <Title as="h4" className="text-gray-500">
          Completa la{" "}
          <span className="text-primary">
            {getOptionLabel(
              [
                ...BookingTypeOptions,
                {
                  label: "Urgencia",
                  value: BookingType.URGENCY,
                },
              ],
              booking.type
            )}
          </span>
        </Title>
        <div className="pl-auto">
          <Button type="submit" loading={isLoading} size="sm">
            Completar
          </Button>
        </div>
      </header>
      <BookingTypeForm />
    </Form>
  );
}
