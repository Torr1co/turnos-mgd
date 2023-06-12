import React from "react";
import Form from "~/components/_common/Form";
import { PetCreationSchema } from "~/schemas/petSchema";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import Title from "~/components/_common/Typo/Title";
import PetForm from "./ClientRegister/PetForm";
import Button from "~/components/_common/Button";
import { z } from "zod";
import { useForm } from "~/utils/schemaUtils";

export default function PetRegister({ ownerId }: { ownerId: string }) {
  const methods = useForm<{ dog: PetCreationSchema }>({
    schema: z.object({ dog: PetCreationSchema }),
    defaultValues: {
      dog: {
        gender: "MALE",
        race: "Mestizo",
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
            toast.success("Perro registrado");
            methods.reset();
          },
          onError: (error) => toast.error(error.message),
        });
      }}
    >
      <header className="sticky top-10 z-30 -mx-4 flex items-center justify-between bg-white p-4 pb-4">
        <Title as="h4" className="text-gray-500">
          Sobre el <span className="text-primary">Perro</span>
        </Title>
        <div className="pl-auto">
          <Button type="submit" loading={isLoading} size="sm">
            Registrar Perro
          </Button>
        </div>
      </header>
      <PetForm />
    </Form>
  );
}
