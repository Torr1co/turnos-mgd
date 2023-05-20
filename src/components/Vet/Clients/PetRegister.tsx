import React from "react";
import Form from "~/lib/Form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PetCreationSchema, type PetCreation } from "~/schemas/pet";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import Title from "~/lib/Typo/Title";
import PetForm from "./ClientRegister/PetForm";
import Button from "~/lib/Button";
import { z } from "zod";

export default function PetRegister({ ownerId }: { ownerId: string }) {
  const methods = useForm<{ dog: PetCreation }>({
    resolver: zodResolver(z.object({ dog: PetCreationSchema })),
    defaultValues: {
      dog: {
        gender: "MALE",
        owner: ownerId,
      },
    },
  });
  const utils = api.useContext();
  const { mutate: createPet, isLoading } = api.pets.create.useMutation({
    onSuccess: async () => {
      await utils.clients.getAll.invalidate();
    },
  });

  return (
    <Form
      className="flex flex-col gap-6"
      methods={methods}
      onSubmit={(data) => {
        createPet(data.dog, {
          onSuccess: () => {
            toast.success("Mascota registrada");
            methods.reset();
          },
          onError: () => toast.error("Ha sucedido un error"),
        });
      }}
    >
      <header className="sticky top-10 z-30 -mx-4 flex items-center justify-between bg-white p-4 pb-4">
        <Title as="h4" className="text-gray-500">
          Sobre la <span className="text-primary">Mascota</span>
        </Title>
        <div className="pl-auto">
          <Button type="submit" loading={isLoading} size="sm">
            Registrar Mascota
          </Button>
        </div>
      </header>
      <PetForm />
    </Form>
  );
}
