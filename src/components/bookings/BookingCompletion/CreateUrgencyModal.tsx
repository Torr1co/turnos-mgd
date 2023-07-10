import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Title from "~/components/_common/Typo/Title";
import Button from "~/components/_common/Button";
import Form from "~/components/_common/Form";
import { useModal } from "~/context/ModalContex";
import UrgencyForm from "./UrgencyForm";
import { UrgencySchema } from "~/schemas/urgencySchema";

export default function CreateUrgencyModal() {
  const { handleModal } = useModal();
  const utils = api.useContext();
  const { mutate: createUrgency, isLoading } =
    api.bookings.createUrgency.useMutation({
      onSuccess: async () => {
        await utils.bookings.getAll.invalidate();
      },
    });
  const methods = useForm<UrgencySchema>({
    resolver: zodResolver(UrgencySchema),
    defaultValues: {
      urgency: {
        clientId: null,
      },
    },
  });
  return (
    <Form
      methods={methods}
      className="flex flex-col gap-6"
      onSubmit={(data) => {
        createUrgency(
          {
            ...data,
            weight: data.urgency.petId ? data.weight : undefined,
            vaccine: data.urgency.enableVaccine ? data.vaccine : undefined,
            general: {
              ...data.general,
              height: data.urgency.petId ? data.general?.height : undefined,
            },
            castration: data.urgency.enableCastration
              ? data.castration
              : undefined,
            deworming: data.urgency.enableDeworming
              ? data.deworming
              : undefined,
          },
          {
            onSuccess: () => {
              toast.success("Urgencia creada con exito");
              handleModal();
            },
            onError: (err) => toast.error(err.message),
          }
        );
      }}
    >
      <header className="sticky top-10 z-30 -mx-4 flex items-center justify-between bg-white p-4 pb-4">
        <Title as="h4" className="text-gray-500">
          Completa la <span className="text-red-500">Urgencia</span>
        </Title>
        <div className="pl-auto">
          <Button
            type="submit"
            loading={isLoading}
            size="sm"
            kind={Button.KINDS.danger}
          >
            Registrar urgencia
          </Button>
        </div>
      </header>
      <UrgencyForm />
    </Form>
  );
}
