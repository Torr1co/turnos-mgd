import React from "react";
import { useSession } from "next-auth/react";
import Dropdown from "../_common/Dropdown";
import Button from "../_common/Button";
import Form from "../_common/Form";
import { BookingStatusOptions } from "~/schemas";
import { api } from "~/utils/api";
import { UserRoles } from "@prisma/client";

/* export const RegisterUrgency = () => {
  const { handleModal } = useModal();

  return (
    <Button
      kind={Button.KINDS.danger}
      onClick={() => handleModal(<CreateUrgencyModal />)}
      type="button"
    >
      Urgencia
    </Button>
  );
}; */

/* export const CancelBooking = ({ booking }: { booking: Booking }) => {
  const [visible, setVisible] = useState(false);
  const utils = api.useContext();

  return (
    <ConfirmTooltip
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
}; */

export const BookingFilters = () => {
  const { data: session } = useSession();
  const { data: businesses = [], isLoading } = api.businesses.getAllBy.useQuery(
    {
      ownerId:
        session?.user.role === UserRoles.ADMIN ? undefined : session?.user.id,
    }
  );

  return (
    <Dropdown
      label={<Button kind={Button.KINDS.gray}>Opciones</Button>}
      placement={"bottomRight"}
    >
      <div className=" flex min-w-[320px] flex-col gap-4">
        <Form.DateRange
          path="filters.rangeDate"
          label="Filtrar por rango de fechas"
        />
        <Form.Select
          label="Filtrar por estado del turno"
          kind="bg-white"
          path="filters.status"
          values={[
            {
              value: null,
              label: "Todos los estados",
            },
            ...BookingStatusOptions,
          ]}
        >
          Todos los tipos
        </Form.Select>
        {!isLoading && (
          <Form.Select
            label="Filtrar por negocio"
            kind="bg-white"
            path="filters.business"
            values={[
              {
                value: null,
                label: "Todos los negocios",
              },
              ...businesses.map((business) => ({
                value: business.id,
                label: business.title,
              })),
            ]}
          >
            Todos los tipos
          </Form.Select>
        )}
      </div>
    </Dropdown>
  );
};
