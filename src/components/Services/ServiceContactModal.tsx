import React from "react";
import { type Service } from "@prisma/client";
import { useModal } from "~/context/ModalContex";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useForm } from "~/utils/schemaUtils";
import { ContactSchema } from "~/schemas/contactSchema";
import Form from "../_common/Form";
import { toast } from "react-hot-toast";
import Title from "../_common/Typo/Title";
import Button from "../_common/Button";
import ContactForm from "../ContactForm";
import { ServiceItem } from "./ServicesList";

export default function ServiceContactModal({ service }: { service: Service }) {
  const { handleModal } = useModal();

  const { data: session } = useSession();
  const { mutate: contact, isLoading } = api.services.contact.useMutation();
  const methods = useForm<ContactSchema>({
    schema: ContactSchema,
    defaultValues: {
      id: service.id,
      receipt: service.email,
      name: session?.user.name,
      lastname: session?.user.lastname,
      telephone: session?.user.telephoneNumber ?? undefined,
      sender: session?.user.email,
    },
  });

  return (
    <Form
      methods={methods}
      className="flex max-w-2xl flex-col gap-12"
      onSubmit={(data) => {
        contact(data, {
          onSuccess: () => {
            toast.success("Se ha enviado tu solicitud");
            handleModal();
          },
          onError: (error) => toast.error(error.message),
        });
      }}
    >
      <header className="sticky top-10 z-30 -mx-4 flex items-center justify-between bg-white p-4 pb-4">
        <Title as="h4" className="text-gray-500">
          Formulario de <span className="text-primary">Contacto</span>
        </Title>
        <div className="pl-auto">
          <Button type="submit" loading={isLoading} size="sm">
            Contactar
          </Button>
        </div>
      </header>
      <section>
        <ContactForm />
      </section>
      <hr />
      <section className="flex flex-col gap-12">
        <ServiceItem service={service} />
      </section>
    </Form>
  );
}
