import React from "react";
import { useSession } from "next-auth/react";
import Title from "../_common/Typo/Title";
import Button from "../_common/Button";
import ContactForm from "../Contact/ContactForm";
import { ContactSchema } from "~/schemas/contactSchema";
import { useForm } from "~/utils/schemaUtils";
import Form from "../_common/Form";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useModal } from "~/context/ModalContex";

interface ContactModalProps {
  children?: React.ReactNode;
  to: string;
  reason: string;
  subject: string;
}

export default function ContactModal(props: ContactModalProps) {
  const { handleModal } = useModal();
  const { data: session } = useSession();
  const { mutate: sendEmail, isLoading } = api.contact.sendEmail.useMutation();
  const methods = useForm<ContactSchema>({
    schema: ContactSchema,
    defaultValues: {
      to: props.to,
      subject: props.subject,
      reason: props.reason,
      name: session?.user.name,
      lastname: session?.user.lastname,
      telephone: session?.user.telephoneNumber ?? undefined,
      from: session?.user.email,
    },
  });

  return (
    <Form
      methods={methods}
      className="flex max-w-2xl flex-col gap-12"
      onSubmit={(data) => {
        sendEmail(data, {
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
      {props.children}
      {/*  <section className="flex flex-col gap-12">
        <ServiceItem service={service} />
      </section> */}
    </Form>
  );
}
