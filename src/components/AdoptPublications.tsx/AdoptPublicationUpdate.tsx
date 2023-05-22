import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { AdoptUpdateSchema } from "~/schemas/adoptPublication";
import toast from "react-hot-toast";
import Title from "~/lib/Typo/Title";
import Button from "~/lib/Button";
import Form from "~/lib/Form";
import { useModal } from "~/context/ModalContex";
import AdoptPublicationCreationForm from "./AdoptPublicationCreationForm";
import { type AdoptPublication, type Dog } from "@prisma/client";

export default function AdoptPublicationUpdate({
  adoption,
}: {
  adoption: AdoptPublication & { dog: Dog };
}) {
  const { handleModal } = useModal();
  const utils = api.useContext();
  const { mutate: createPublication, isLoading } =
    api.adoptPublications.update.useMutation({
      onSuccess: async () => {
        await utils.adoptPublications.getAll.invalidate();
      },
    });
  const methods = useForm<AdoptUpdateSchema>({
    resolver: zodResolver(AdoptUpdateSchema),
    defaultValues: {
      id: adoption.id,
      email: adoption.email,
      reason: adoption.reason,
      info: adoption.info ? adoption.info : undefined,
      dog: {
        name: adoption.dog.name ? adoption.dog.name : undefined,
        birth: adoption.dog.birth ? adoption.dog.birth : undefined,
        race: adoption.dog.race ? adoption.dog.race : undefined,
        gender: adoption.dog.gender ? adoption.dog.gender : undefined,
        height: adoption.dog.height ? adoption.dog.height : undefined,
        weight: adoption.dog.weight ? adoption.dog.weight : undefined,
        color: adoption.dog.color ? adoption.dog.color : undefined,
      },
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
          Actualizar publicacion de 
          <span className="text-primary">Adopcion</span>
        </Title>
        <div className="pl-auto">
          <Button type="submit" loading={isLoading} size="sm">
            Actualizar
          </Button>
        </div>
      </header>
      <AdoptPublicationCreationForm />
    </Form>
  );
}
