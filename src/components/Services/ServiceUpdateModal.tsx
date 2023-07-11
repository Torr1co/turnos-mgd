import React from "react";
import { ServiceUpdateSchema } from "~/schemas/serviceSchema";
import { api } from "~/utils/api";
import { useForm } from "~/utils/schemaUtils";
import { type Service } from "@prisma/client";
import Form from "../_common/Form";
import Title from "../_common/Typo/Title";
import Button from "../_common/Button";
import ServiceForm from "./ServiceForm";
import { toast } from "react-hot-toast";
import { useModal } from "~/context/ModalContex";

export default function ServiceUpdateModal({ service }: { service: Service }) {
  const { handleModal } = useModal();
  const methods = useForm<ServiceUpdateSchema>({
    schema: ServiceUpdateSchema,
    defaultValues: service,
  });
  const utils = api.useContext();
  const { mutate: registerServices, isLoading } =
    api.services.update.useMutation({
      onSuccess: async () => {
        await utils.services.getAll.invalidate();
      },
    });

  return (
    <Form
      className="flex flex-col gap-6"
      methods={methods}
      onSubmit={(data) => {
        registerServices(data, {
          onSuccess: () => {
            toast.success("Servicio actualizado exitosamente");
            handleModal();
          },
          onError: (error) => toast.error(error.message),
        });
      }}
    >
      <header className="sticky top-10 z-30 -mx-4 flex items-center justify-between bg-white p-4 pb-4">
        <Title as="h4" className="text-gray-500">
          Actualiza el <span className="text-primary">Servicio</span>
        </Title>
        <div className="pl-auto">
          <Button type="submit" loading={isLoading} size="sm">
            Actualizar servicio
          </Button>
        </div>
      </header>
      <ServiceForm type="UPDATE" />
    </Form>
  );
}
