import React, { useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmTooltip from "~/components/_common/ConfirmTooltip";
import { api } from "~/utils/api";
import { ArrowSmallRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { UserRoles, type Booking } from "@prisma/client";
import { useSession } from "next-auth/react";
import Dropdown from "../_common/Dropdown";
import Button from "../_common/Button";
import Form from "../_common/Form";
import { BookingStatus } from "@prisma/client";
import { useModal } from "~/context/ModalContex";
import BookingUpdateModal from "../Home/ClientHome/ClientBookings/BookingUpdateModal";
import { isVet } from "~/utils/schemas/usersUtils";
import { cn } from "~/utils/styleUtils";
import Link from "next/dist/client/link";
import { LINKS } from "~/utils/navConfig";
import BookingCompletionModal from "./BookingCompletion/BookingCompletionModal";
import Text from "../_common/Typo/Text";
import CreateUrgencyModal from "./BookingCompletion/CreateUrgencyModal";
import { BookingTypeOptions, type BookingRelated } from "~/schemas";

export const RegisterUrgency = () => {
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
};

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

export const BookingFilters = () => {
  const { data: session } = useSession();
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
          label="Filtrar por tipo de turno"
          kind="bg-white"
          path="filters.bookingType"
          values={[
            {
              value: null,
              label: "Todos los tipos",
            },
            ...BookingTypeOptions,
          ]}
        >
          Todos los tipos
        </Form.Select>
        {session?.user.role === UserRoles.VET && (
          <Form.Input
            label="Filtrar por nombre o email de cliente"
            path={"filters.text"}
            placeholder="Buscar por nombre o email de cliente"
          />
        )}
      </div>
    </Dropdown>
  );
};

export const BookingActions = ({ booking }: { booking: BookingRelated }) => {
  const { data: session } = useSession();
  const { handleModal } = useModal();
  const status = booking.status;

  const ClientActions = () => {
    return (
      <>
        {(status === BookingStatus.PENDING ||
          status === BookingStatus.APPROVED) && (
          <Button
            kind={Button.KINDS.gray}
            onClick={() => {
              handleModal(<BookingUpdateModal booking={booking} />);
            }}
          >
            Editar
          </Button>
        )}
      </>
    );
  };

  const VetActions = () => {
    const [visible, setVisible] = useState(false);
    const utils = api.useContext();
    const { mutate: approveBooking, isLoading } =
      api.bookings.approve.useMutation({
        onSuccess: async () => {
          await utils.bookings.getAll.invalidate();
        },
      });

    return (
      <>
        {status === BookingStatus.APPROVED && (
          <Button
            kind={Button.KINDS.gray}
            onClick={() =>
              handleModal(<BookingCompletionModal booking={booking} />)
            }
          >
            Completar
          </Button>
        )}

        {status === BookingStatus.PENDING && (
          <ConfirmTooltip
            loading={isLoading}
            open={visible}
            onReject={() => setVisible(false)}
            onConfirm={() => {
              approveBooking(booking.id, {
                onSuccess: () => {
                  setVisible(false);
                  toast.success("Turno aprobado con exito");
                },
                onError: (err) => {
                  toast.error(err.message);
                },
              });
            }}
          >
            <Button kind={Button.KINDS.gray} onClick={() => setVisible(true)}>
              Aprobar
            </Button>
          </ConfirmTooltip>
        )}
      </>
    );
  };

  return (
    <div className="flex gap-4">
      {isVet(session?.user) ? <VetActions /> : <ClientActions />}
      {status === BookingStatus.COMPLETED && (
        <Link href={LINKS.booking(booking.id)}>
          <Button
            kind={Button.KINDS.gray}
            className="group flex items-center gap-2"
          >
            Ver mas
            <ArrowSmallRightIcon
              className={cn("h-5 w-5 stroke-2 transition-opacity duration-300")}
              style={{
                transform: "rotate(-45deg)",
              }}
            />
          </Button>
        </Link>
      )}
      {status === BookingStatus.CANCELLED && (
        <Text className="font-semibold text-red-400">TURNO CANCELADO</Text>
      )}
      {(status === BookingStatus.APPROVED ||
        status === BookingStatus.PENDING) && (
        <CancelBooking booking={booking} />
      )}
    </div>
  );
};
