import React, { useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmTooltip from "~/components/_common/ConfirmTooltip";
import { api } from "~/utils/api";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { UserRoles, type Booking } from "@prisma/client";
import Dropdown from "../_common/Dropdown";
import Button from "../_common/Button";
import Form from "../_common/Form";
import { BookingOptions } from "~/schemas/bookingSchema";

export const CancelBooking = ({ booking }: { booking: Booking }) => {
  const [visible, setVisible] = useState(false);
  const utils = api.useContext();
  const { mutate: cancelBooking, isLoading } = api.bookings.cancel.useMutation({
    onSuccess: async () => {
      await utils.bookings.getAll.invalidate();
    },
  });

  return (
    <ConfirmTooltip
      loading={isLoading}
      open={visible}
      onReject={() => setVisible(false)}
      onConfirm={() => {
        cancelBooking(booking.id, {
          onSuccess: () => {
            setVisible(false);
            toast.success("Turno cancelado con exito");
          },
          onError: (err) => {
            toast.error(err.message);
          },
        });
      }}
    >
      <button
        onClick={() => setVisible(true)}
        type="button"
        className=" grid h-12 w-12 items-center rounded-full bg-gray-300 p-2"
      >
        <XMarkIcon className="text-gray-600" />
      </button>
    </ConfirmTooltip>
  );
};

export const BookingFilters = ({ role }: { role?: UserRoles }) => {
  return (
    <Dropdown
      label={<Button kind={Button.KINDS.gray}>Opciones</Button>}
      placement={"bottomRight"}
    >
      <div className=" flex min-w-[320px] flex-col gap-4">
        <Form.RangeDate
          path="filters.rangeDate"
          label="Filtrar por rango de fechas"
        />
        <Form.Select
          label="Filtrar por tipo de turno"
          kind="bg-white"
          path="filters.bookingType"
          values={[
            {
              value: undefined,
              label: "Todos",
            },
            ...BookingOptions,
          ]}
        >
          Todos los Turnos
        </Form.Select>
        {role === UserRoles.VET && (
          <Form.Input
            label="Filtrar por nombre de cliente o email"
            path={"filters.text"}
            placeholder="Buscar por nombre de cliente o email"
          />
        )}
      </div>
    </Dropdown>
  );
};
