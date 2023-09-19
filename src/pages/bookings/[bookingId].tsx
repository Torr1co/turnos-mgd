import React from "react";
import { type GetServerSideProps } from "next";
import { bookingsRouter } from "~/server/api/routers/bookingsRouter";
import { prisma } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";
import Title from "~/components/_common/Typo/Title";
import BookingInfo from "~/components/bookings/BookingInfo";
import StickyLayout from "~/components/Layout/StickyLayout";
import Button from "~/components/_common/Button";
import { type BookingRelated } from "~/schemas";
import Link from "~/components/_common/Link";
import { LINKS } from "~/utils/navUtils";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  const trpc = bookingsRouter.createCaller({ session, prisma });
  try {
    const booking = await trpc.getBy({
      id: ctx.params?.bookingId as string,
    });
    return {
      props: {
        booking: JSON.stringify(booking),
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

type BookingPageProps = {
  booking: string;
};

export default function BookingId(props: BookingPageProps) {
  const booking = JSON.parse(props.booking) as BookingRelated;
  return (
    <div>
      <header className="my-8 flex items-center justify-between">
        <Title>Haz reservado tu turno satisfactoriamente!</Title>
      </header>
      <StickyLayout>
        <div>
          <BookingInfo booking={booking} />
          {booking.payment && (
            <div className="my-4 flex flex-col gap-4">
              <div>
                <span className="text-left font-medium text-gray-500">
                  Monto pagado:{" "}
                </span>
                <span className="pl-2 text-right text-lg font-semibold">
                  {booking.payment.amount}
                </span>
              </div>
              {
                <div>
                  <span className="text-left font-medium text-gray-500">
                    Monto a pagar restante:{" "}
                  </span>
                  <span className="pl-2 text-right text-lg font-semibold">
                    {booking.totalAmount
                      ? booking.totalAmount - booking.payment.amount
                      : "El pago fue completo"}
                  </span>
                </div>
              }
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <Button
              onClick={async () => {
                await navigator.share({
                  title: "Turno reservado",
                  text: "Turno reservado satisfactoriamente",
                  url: window.location.toString(),
                });
              }}
            >
              Compartir
            </Button>
          </div>
          <Link href={LINKS.myBookings} arrow active>
            Ver todos mis turnos Reservados
          </Link>
        </div>
      </StickyLayout>
    </div>
  );
}
