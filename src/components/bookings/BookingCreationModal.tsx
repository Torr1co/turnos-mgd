import React, { useState } from "react";
import Form from "~/components/_common/Form";
import Title from "~/components/_common/Typo/Title";
import { type BusinessRelated } from "~/schemas/businessSchema";
import { api } from "~/utils/api";
import Button from "~/components/_common/Button";
import { toast } from "react-hot-toast";
import { useForm } from "~/utils/schemaUtils";
import { hasFormErrors } from "~/utils/errors";
import BookingForm from "./BookingForm";
import { z } from "zod";
import { LINKS } from "~/utils/navUtils";
import { useRouter } from "next/router";
import { StartBookingSchema } from "~/schemas";
import { useModal } from "~/context/ModalContex";
import { useSession } from "next-auth/react";
import { BookingsLocalData } from "~/utils/bookingUtils";

export default function BookingCreationModal({
  business,
}: {
  business: BusinessRelated;
}) {
  const methods = useForm<StartBookingSchema>({
    schema: StartBookingSchema.superRefine((values, ctx) => {
      const selectedService = business.services.find(
        (s) => s.id === values.serviceId
      );

      if (selectedService && selectedService.price !== 0) {
        if (values.payment.amount < selectedService.price / 10) {
          ctx.addIssue({
            message: `Minimo $${selectedService.price / 10}`,
            path: ["payment", "amount"],
            code: z.ZodIssueCode.custom,
          });
        } else if (values.payment.amount > selectedService.price) {
          ctx.addIssue({
            message: `Maximo $${selectedService.price}`,
            path: ["payment", "amount"],
            code: z.ZodIssueCode.custom,
          });
        }
      }
    }),
    defaultValues: {
      payment: {
        amount: 0,
      },
    },
  });
  const { handleModal } = useModal();
  const [Wallet, setWallet] = useState<JSX.Element | null>(null);
  const router = useRouter();
  const { mutate: startBooking, isLoading: isStarting } =
    api.bookings.startBooking.useMutation({
      onSuccess: async (preferenceId) => {
        const { initMercadoPago, Wallet } = await import(
          "@mercadopago/sdk-react"
        );
        initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ?? "");
        setWallet(
          <Wallet
            customization={{
              visual: {
                borderRadius: "0px",
              },
            }}
            initialization={{ preferenceId }}
            locale="es-AR"
          />
        );
      },
    });

  const { data: session } = useSession();
  const { mutate: createBooking, isLoading: isCreating } =
    api.bookings.create.useMutation({
      onSuccess: async (booking) => {
        if (!session?.user) {
          BookingsLocalData.addById(booking.id);
        }
        await router.push(`${LINKS.bookings + "/" + booking.id}`);
      },
    });

  return (
    <Form
      className="flex flex-col gap-6"
      methods={methods}
      onSubmit={(data) => {
        if (data.payment.amount === 0) {
          createBooking(
            {
              ...data,
              payment: undefined,
            },
            {
              onSuccess: () => handleModal(),
              onError: (err) => {
                toast.error(err.message);
              },
            }
          );
          return;
        }
        startBooking(data, {
          onSuccess: () => {
            toast.success("Pasarela creada con exito");
          },
          onError: (err) => {
            toast.error(err.message);
          },
        });
      }}
    >
      {hasFormErrors(methods.formState) && (
        <div className="rounded-md bg-red-100 p-4 text-red-600">
          <p>Hay errores en el formulario</p>
        </div>
      )}
      <header className="sticky top-10 z-30 -mx-4 flex items-center justify-between bg-white p-4 pb-4">
        <Title as="h4" className="text-gray-500">
          Reserva un <span className="text-primary">turno</span>
        </Title>
      </header>
      <BookingForm business={business} />
      <div className="flex">
        <div>
          <Button
            type="submit"
            size="md"
            disabled={hasFormErrors(methods.formState)}
            loading={isStarting || isCreating}
          >
            Reservar turno
          </Button>
        </div>
        <div className="-my-[23px] w-min scale-[0.8]">{Wallet}</div>
      </div>
    </Form>
  );
}
