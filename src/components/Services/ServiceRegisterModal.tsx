import React from "react";
import { ServiceCreationSchema } from "~/schemas/serviceSchema";
import { api } from "~/utils/api";
import { useForm } from "~/utils/schemaUtils";
import { ServiceTypes } from "@prisma/client";
import Form from "../_common/Form";
import Title from "../_common/Typo/Title";
import Button from "../_common/Button";
import ServiceForm from "./ServiceForm";
import { toast } from "react-hot-toast";
import { useModal } from "~/context/ModalContex";

export default function ServiceRegisterModal() {
  const { handleModal } = useModal();
  const methods = useForm<ServiceCreationSchema>({
    schema: ServiceCreationSchema,
    defaultValues: {
      types: [ServiceTypes.DOGWALKER],
    },
  });
  const utils = api.useContext();
  const { mutate: registerServices, isLoading } =
    api.services.create.useMutation({
      onSuccess: async () => {
        await utils.services.getAll.invalidate();
      },
    });

  console.log(methods.watch());
  return (
    <Form
      className="flex flex-col gap-6"
      methods={methods}
      onSubmit={(data) => {
        registerServices(data, {
          onSuccess: () => {
            toast.success("Servicio registrado exitosamente");
            handleModal();
          },
          onError: (error) => toast.error(error.message),
        });
      }}
    >
      <header className="sticky top-10 z-30 -mx-4 flex items-center justify-between bg-white p-4 pb-4">
        <Title as="h4" className="text-gray-500">
          Sobre el <span className="text-primary">Servicio</span>
        </Title>
        <div className="pl-auto">
          <Button type="submit" loading={isLoading} size="sm">
            Registrar servicio
          </Button>
        </div>
      </header>
      <ServiceForm />
    </Form>
  );
}
