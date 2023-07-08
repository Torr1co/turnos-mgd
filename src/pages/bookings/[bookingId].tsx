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
  const BookingTypeInfo = BookingTypeConvertion[booking.type];
  return (
    <div className="grid grid-cols-2 gap-8">
      <Box className=" bg-white">
        <BookingInfo booking={booking} />
      </Box>
      <Box className=" bg-white">
        <BookingTypeInfo booking={booking} />
      </Box>
    </div>
  );
}
