import React from "react";
import Form from "~/components/_common/Form";
import Title from "~/components/_common/Typo/Title";
import { BusinessRegisterSchema } from "~/schemas/businessSchema";
import { api } from "~/utils/api";
import Button from "~/components/_common/Button";
import { toast } from "react-hot-toast";
import { useModal } from "~/context/ModalContex";
import { useForm } from "~/utils/schemaUtils";
import BusinessForm from "./BusinessForm";
import ServiceForm from "./ServiceForm";
import { useFieldArray } from "react-hook-form";
import { MAGDALENA_CENTER_LOCATION } from "~/utils/googleMapsUtils";

export default function BusinessRegisterModal({
  ownerId,
}: {
  ownerId: string;
}) {
  const { handleModal } = useModal();
  const methods = useForm<BusinessRegisterSchema>({
    schema: BusinessRegisterSchema,
    defaultValues: {
      ownerId,
      services: [{ title: "Visita sin cargo", price: 0 }],
      days: [false, true, true, true, true, true, false],
      address: `https://www.google.com.ar/maps/@${MAGDALENA_CENTER_LOCATION.lat},${MAGDALENA_CENTER_LOCATION.lng}`,
      schedule: [
        "08:00 - 09:00",
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
      ],
    },
  });
  const servicesMethods = useFieldArray({
    control: methods.control,
    name: "services",
  });
  const hasErrors = Object.keys(methods.formState.errors).length > 0;
  const utils = api.useContext();
  const { mutate: createBusiness, isLoading } =
    api.businesses.create.useMutation({
      onSuccess: async () => {
        await utils.businesses.getAll.invalidate();
      },
    });

  return (
    <Form
      className="flex flex-col gap-6"
      methods={methods}
      onSubmit={(data) => {
        createBusiness(data, {
          onSuccess: () => {
            toast.success("Negocio registrado");
            handleModal();
          },
          onError: (err) => {
            toast.error(err.message);
          },
        });
      }}
    >
      {hasErrors && (
        <div className="rounded-md bg-red-100 p-4 text-red-600">
          <p>Hay errores en el formulario</p>
        </div>
      )}
      <header className="sticky top-10 z-30 -mx-4 flex items-center justify-between bg-white p-4 pb-4">
        <Title as="h4" className="text-gray-500">
          Sobre el <span className="text-primary">Negocio</span>
        </Title>
        <nav className="flex items-center justify-between gap-4">
          <Button
            type="submit"
            size="sm"
            disabled={hasErrors}
            loading={isLoading}
          >
            Registrar Negocio
          </Button>
        </nav>
      </header>
      <BusinessForm />
      <Title
        as="h4"
        className="sticky top-10 z-30 w-fit bg-white py-4 text-gray-500"
      >
        Sobre los <span className="text-primary">Servicios del Negocio</span>
      </Title>
      {servicesMethods.fields.map((service, i) => {
        return (
          <div className="flex" key={service.id}>
            <ServiceForm path={"services"} index={i} />
            {i !== 0 && (
              <div className="self-end pl-6">
                <Button
                  kind={Button.KINDS.danger}
                  onClick={() => {
                    servicesMethods.remove(i);
                  }}
                >
                  Eliminar
                </Button>
              </div>
            )}
          </div>
        );
      })}
      <Button onClick={() => servicesMethods.append({ title: "", price: 0 })}>
        Agregar Servicio
      </Button>
    </Form>
  );
}
