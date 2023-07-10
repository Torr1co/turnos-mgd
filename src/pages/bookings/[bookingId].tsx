import React from "react";
import { type GetServerSideProps } from "next";
import { bookingsRouter } from "~/server/api/routers/bookingsRouter";
import { prisma } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";
import { type BookingRelated } from "~/schemas/bookingSchema";
import BookingInfo from "~/components/bookings/BookingInfo";
import Box from "~/components/_common/Box";
import { BookingType } from "@prisma/client";
import CastrationInfo from "~/components/bookings/BookingInfo/CastrationInfo";
import InquirieInfo from "~/components/bookings/BookingInfo/InquirieInfo";
import DewormingInfo from "~/components/bookings/BookingInfo/DewormingInfo";
import VaccineInfo from "~/components/bookings/BookingInfo/VaccineInfo";
import Title from "~/components/_common/Typo/Title";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  const trpc = bookingsRouter.createCaller({ session, prisma });
  try {
    const booking = await trpc.get(ctx.params?.bookingId as string);
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

const BookingTypeConvertion = {
  [BookingType.CASTRATION]: CastrationInfo,
  [BookingType.DEWORMING]: DewormingInfo,
  [BookingType.GENERAL]: InquirieInfo,
  [BookingType.VACCINE]: VaccineInfo,
  [BookingType.URGENCY]: BookingInfo,
} as const;

export default function BookingPage(props: BookingPageProps) {
  const booking = JSON.parse(props.booking) as BookingRelated;
  return (
    <div>
      <header className="mb-14 flex items-center justify-between">
        <Title>Informacion del turno</Title>
      </header>

      <section className="grid  place-items-center">
        <Box className=" w-full max-w-4xl bg-white">
          <BookingInfo booking={booking} />
        </Box>
      </section>
    </div>
  );
}
