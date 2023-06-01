import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { AdoptCreationSchema } from "~/schemas/adoptionSchema";
import toast from "react-hot-toast";
import Title from "~/components/_common/Typo/Title";
import Button from "~/components/_common/Button";
import Form from "~/components/_common/Form";
import { useModal } from "~/context/ModalContex";
import AdoptPublicationForm from "./AdoptPublicationForm";
import { useSession } from "next-auth/react";

export default function AdoptCreationModal() {
  const { handleModal } = useModal();
  const { data: session } = useSession();
  const utils = api.useContext();
  const { mutate: createPublication, isLoading } =
    api.adoptPublications.create.useMutation({
      onSuccess: async () => {
        await utils.adoptPublications.getAll.invalidate();
      },
    });
  const methods = useForm<AdoptCreationSchema>({
    resolver: zodResolver(AdoptCreationSchema),
    defaultValues: {
      dog: {
        gender: "MALE",
        height: 0,
        weight: 0,
        race: "Mestizo",
      },
      email: session?.user.email,
    },
  });

  return (
    <Form
      methods={methods}
      className="flex flex-col gap-6"
      onSubmit={(data) => {
        createPublication(data, {
          onSuccess: () => {
            toast.success("Publicacion creada con exito");
            handleModal();
          },
          onError: () => toast.error("Ha sucedido un error"),
        });
      }}
    >
      <header className="sticky top-10 z-30 -mx-4 flex items-center justify-between bg-white p-4 pb-4">
        <Title as="h4" className="text-gray-500">
          Publicacion de <span className="text-primary">Adopcion</span>
        </Title>
        <div className="pl-auto">
          <Button type="submit" loading={isLoading} size="sm">
            Publicar
          </Button>
        </div>
      </header>
      <AdoptPublicationForm />
    </Form>
  );
}
