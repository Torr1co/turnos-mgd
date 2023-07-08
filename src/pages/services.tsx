import React from "react";
import ServiceRegisterModal from "~/components/Services/ServiceRegisterModal";
import { ServicesFilters } from "~/components/Services/ServicesActions";
import ServicesList from "~/components/Services/ServicesList";
import Button from "~/components/_common/Button";
import Title from "~/components/_common/Typo/Title";
import { useModal } from "~/context/ModalContex";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { type ServiceTypes } from "@prisma/client";
import { useForm } from "react-hook-form";
import Form from "~/components/_common/Form";
import { isVet } from "~/utils/schemas/usersUtils";

type FilterProps = {
  serviceType: ServiceTypes | null;
  email: string;
  enabled: boolean;
};
const Services = () => {
  const { data: session } = useSession();
  const { handleModal } = useModal();
  const methods = useForm<FilterProps>({
    defaultValues: {
      serviceType: null,
      email: "",
      enabled: true,
    },
  });
  const filters = methods.watch();
  const { data: services = [], isLoading } = api.services.getAll.useQuery(
    {
      enabled: filters.enabled,
    },
    {}
  );
  return (
    <div>
      <header className="mb-14 flex items-center justify-between">
        <Title>
          Servicios{" "}
          {isVet(session?.user)
            ? filters.enabled
              ? "habilitados"
              : "deshabilitados"
            : ""}
        </Title>
        <div className="flex gap-4">
          <Form methods={methods}>
            <ServicesFilters />
          </Form>
          {isVet(session?.user) && (
            <Button
              kind={Button.KINDS.gray}
              onClick={() => handleModal(<ServiceRegisterModal />)}
            >
              Registrar servicio
            </Button>
          )}
        </div>
      </header>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <ServicesList
          services={services.filter((service) => {
            if (filters.serviceType && service.type !== filters.serviceType)
              return false;
            if (filters.email && !service.email.includes(filters.email))
              return false;
            return true;
          })}
        />
      )}
    </div>
  );
};

export default Services;
