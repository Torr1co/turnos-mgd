import React from "react";
import Title from "~/components/_common/Typo/Title";
import { api } from "~/utils/api";
import BookingsTable from "~/components/bookings/BookingsTable";
import { useForm } from "react-hook-form";
import { BookingFilters } from "~/components/bookings/BookingActions";
import Form from "~/components/_common/Form";

type FilterProps = {
  rangeDate?: [Date, Date];
  status?: string;
  business?: string;
};
const Bookings = () => {
  const { data: bookings = [], isLoading } = api.bookings.getAll.useQuery();
  const methods = useForm<{ filters: FilterProps }>({
    defaultValues: {
      filters: {},
    },
  });
  return (
    <div>
      <header className="flex items-center justify-between py-8">
        <Title>Turnos reservados</Title>
        <div className="flex gap-4">
          <Form methods={methods}>
            <BookingFilters />
          </Form>
        </div>
      </header>

      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <BookingsTable
          bookings={bookings.filter((booking) => {
            const { filters } = methods.watch();
            if (filters.status && filters.status !== booking.status)
              return false;
            if (
              filters.business &&
              filters.business !== booking.service.business.id
            )
              return false;
            if (
              filters.rangeDate &&
              (booking.date < filters.rangeDate[0] ||
                booking.date > filters.rangeDate[1])
            )
              return false;
            return true;
          })}
        />
      )}
    </div>
  );
};

export default Bookings;
