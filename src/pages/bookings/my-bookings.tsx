import React, { useEffect } from "react";
import Title from "~/components/_common/Typo/Title";
import { api } from "~/utils/api";
import BookingsTable from "~/components/bookings/BookingsTable";
import { BookingsLocalData } from "~/utils/bookingUtils";

const MyBookings = () => {
  const [localBookings, setLocalBookings] = React.useState<
    string[] | undefined
  >(undefined);
  const { data: bookings = [], isLoading } =
    api.bookings.getMine.useQuery(localBookings);

  useEffect(() => {
    setLocalBookings(BookingsLocalData.getMine() ?? undefined);
  }, []);

  return (
    <div>
      <header className="flex items-center justify-between py-8">
        <Title>Mis Turnos reservados</Title>
      </header>

      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <BookingsTable bookings={bookings} mine />
      )}
    </div>
  );
};

export default MyBookings;
