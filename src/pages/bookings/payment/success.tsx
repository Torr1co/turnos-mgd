import React from "react";
import { type GetServerSideProps } from "next";
import { bookingsRouter } from "~/server/api/routers/bookingsRouter";
import { prisma } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";
import Title from "~/components/_common/Typo/Title";
import { type BookingRelated } from "~/schemas";
import BookingInfo from "~/components/bookings/BookingInfo";
import StickyLayout from "~/components/Layout/StickyLayout";
import Button from "~/components/_common/Button";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  const trpc = bookingsRouter.createCaller({ session, prisma });
  try {
    const booking = await trpc.getBy({
      paymentId: ctx.query.payment_id as string,
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

type PaymentPageProps = {
  booking: string;
};

export default function BookingPaymentSuccess(props: PaymentPageProps) {
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
            <div className="my-4">
              <span className="text-left font-medium text-gray-500">
                Monto pagado:{" "}
              </span>
              <span className="pl-2 text-right text-lg font-semibold">
                ${booking.payment.amount}
              </span>
            </div>
          )}
        </div>
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
      </StickyLayout>
    </div>
  );
}
