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
import { type AdoptPublication, type Dog } from "@prisma/client";
import AdoptForm from "./AdoptForm";
import { AdoptItem } from "./AdoptList";

export default function Adopt({
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
          Adopta una <span className="text-primary">Mascota</span>
        </Title>
        <div className="pl-auto">
          <Button type="submit" loading={isLoading} size="sm">
            Adoptar
          </Button>
        </div>
      </header>
      <div className="flex gap-12">
        <div className="max-w-sm">
          <AdoptItem adoption={adoption} />
        </div>
        <div className="">
          <AdoptForm />
        </div>
      </div>
    </Form>
  );
}
