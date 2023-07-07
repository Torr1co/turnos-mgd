import React from "react";
import dayjs from "dayjs";
import { api } from "~/utils/api";
import BookingList from "../../../bookings/BookingList";
import { useForm } from "react-hook-form";
import { type BookingType, BookingStatus } from "@prisma/client";
import Form from "~/components/_common/Form";
import { BookingFilters } from "../../../bookings/BookingActions";
import Button from "~/components/_common/Button";
import BookingCreationModal from "./BookingCreationModal";
import { useModal } from "~/context/ModalContex";
import { FieldSelectHeader } from "~/components/_common/Form/Select";
import { BookingStatusOptions } from "~/schemas";

type FilterProps = {
  bookingType: BookingType | null;
  bookingStatus: BookingStatus;
  rangeDate?: [Date, Date];
};

export default function ClientBookings() {
  const methods = useForm<{ filters: FilterProps }>({
    defaultValues: {
      filters: {
        rangeDate: undefined,
        bookingType: null,
        bookingStatus: BookingStatus.APPROVED,
      },
    },
  });
  const { handleModal } = useModal();
  const filters = methods.watch("filters");
  const { data: bookings = [], isLoading } = api.bookings.getAll.useQuery({
    status: filters.bookingStatus,
  });
  return (
    <section>
      <Form methods={methods}>
        <header className="mb-14 flex items-center justify-between">
          <FieldSelectHeader
            path="filters.bookingStatus"
            values={BookingStatusOptions}
          />
          <div className="flex gap-4">
            <BookingFilters />
            <Button
              kind={Button.KINDS.gray}
              onClick={() => handleModal(<BookingCreationModal />)}
              className="text-base"
            >
              Reservar Turno
            </Button>
          </div>
        </header>
      </Form>
      <div>
        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          <BookingList
            bookings={bookings.filter((booking) => {
              const includesDate =
                !filters.rangeDate ||
                (!dayjs(filters.rangeDate[0]).isAfter(booking.date, "d") &&
                  !dayjs(booking.date).isAfter(filters.rangeDate[1], "d"));

              const includesType =
                !filters.bookingType || filters.bookingType === booking.type;

              return includesDate && includesType;
            })}
          />
        )}
      </div>
    </section>
  );
}
