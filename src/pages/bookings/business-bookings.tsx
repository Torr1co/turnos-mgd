import React from "react";
import Title from "~/components/_common/Typo/Title";
import Button from "~/components/_common/Button";
import Input from "~/components/_common/Form/Input";
import Dropdown from "~/components/_common/Dropdown";
import { api } from "~/utils/api";
import BookingsTable from "~/components/bookings/BookingsTable";

const MyBusinessBookings = () => {
  const [search, setSearch] = React.useState("");
  const { data: bookings = [], isLoading } =
    api.bookings.getBusinesses.useQuery();

  return (
    <div>
      <header className="flex items-center justify-between py-8">
        <Title>Reservas a mis negocios</Title>
        <div className="flex gap-4">
          <Dropdown
            label={<Button kind={Button.KINDS.gray}>Filtros</Button>}
            className="hover:text-primary"
          >
            <div className="flex min-w-[320px] flex-col gap-4">
              <label className="text-base font-medium text-gray-600">
                Filtrar por nombre de cliente o email
              </label>
              <Input
                className="min-w-[260px]"
                placeholder="Buscar por nombre o email"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
          </Dropdown>
        </div>
      </header>

      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <BookingsTable bookings={bookings} />
      )}
    </div>
  );
};

export default MyBusinessBookings;
