import React from "react";
import Title from "~/components/_common/Typo/Title";
import { type BookingRelated } from "~/schemas/bookingSchema";
import CastrationInfo from "./CastrationInfo";
import DewormingInfo from "./DewormingInfo";
import InquirieInfo from "./InquirieInfo";
import VaccineInfo from "./VaccineInfo";

export default function UrgencyInfo({ booking }: { booking: BookingRelated }) {
  return (
    <>
      {booking.inquirie && (
        <>
          <div className="h-1 w-full bg-gray-300"></div>
          <div>
            <Title as="h4" className="mb-4">
              Informacion de la Urgencia
            </Title>
            <InquirieInfo booking={booking} />
          </div>
        </>
      )}
      {booking.castration && (
        <>
          <div className="h-1 w-full bg-gray-300"></div>
          <CastrationInfo booking={booking} />
        </>
      )}
      {booking.deworming && (
        <>
          <div className="h-1 w-full bg-gray-300"></div>
          <DewormingInfo booking={booking} />
        </>
      )}
      {booking.vaccine && (
        <>
          <div className="h-1 w-full bg-gray-300"></div>
          <VaccineInfo booking={booking} />
        </>
      )}
    </>
  );
}
