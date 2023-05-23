import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { AdoptSchema } from "~/schemas/adoptionSchema";
import toast from "react-hot-toast";
import Title from "~/lib/Typo/Title";
import Button from "~/lib/Button";
import Form from "~/lib/Form";
import { useModal } from "~/context/ModalContex";
import { type AdoptPublication, type Dog } from "@prisma/client";
import AdoptForm from "./AdoptForm";
import { AdoptItem } from "./AdoptList";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import { GenderOptions } from "~/schemas/petSchema";

export default function Adopt({
  adoption,
}: {
  adoption: AdoptPublication & { dog: Dog };
}) {
  const { handleModal } = useModal();

  const { data: session } = useSession();
  const { mutate: createPublication, isLoading } =
    api.adoptPublications.adopt.useMutation();
  const methods = useForm<AdoptSchema>({
    resolver: zodResolver(AdoptSchema),
    defaultValues: {
      id: adoption.id,
      receipt: adoption.email,
      name: session?.user.name,
      lastname: session?.user.lastname,
      telephone: session?.user.telephoneNumber ?? undefined,
      sender: session?.user.email,
    },
  });
  console.log(methods.formState.errors);

  return (
    <Form
      methods={methods}
      className="flex max-w-2xl flex-col gap-12"
      onSubmit={(data) => {
        createPublication(data, {
          onSuccess: () => {
            toast.success("Se ha enviado tu solicitud");
            handleModal();
          },
          onError: () => toast.error("Ha sucedido un error"),
        });
      }}
    >
      <section>
        <header className="sticky top-10 z-30 -mx-4 flex items-center justify-between bg-white p-4 pb-4">
          <Title as="h4" className="text-gray-500">
            Formulario de <span className="text-primary">Adopcion</span>
          </Title>
          <div className="pl-auto">
            <Button type="submit" loading={isLoading} size="sm">
              Adoptar
            </Button>
          </div>
        </header>
        <div>
          <AdoptForm />
        </div>
      </section>
      <hr />
      <section className="flex flex-col gap-12">
        <AdoptItem adoption={adoption} truncate={false} />
        <dl className="grid grid-cols-2 gap-4 text-base">
          {adoption.dog.birth && (
            <>
              <dt>Edad:</dt>
              <dd>
                {dayjs(adoption.dog.birth).format("DD/MM/YYYY")} (
                {dayjs(adoption.dog.birth).toNow(true)})
              </dd>
            </>
          )}
          {adoption.dog.gender && (
            <>
              <dt>Genero:</dt>
              <dd>
                {
                  GenderOptions.find(
                    (gender) => gender.value === adoption.dog.gender
                  )?.label
                }
              </dd>
            </>
          )}
          {adoption.dog.race && (
            <>
              <dt>Raza:</dt>

              <dd>{adoption.dog.race}</dd>
            </>
          )}
          {!!adoption.dog.weight && (
            <>
              <dt>Peso:</dt>

              <dd>{adoption.dog.weight}kg</dd>
            </>
          )}
          {!!adoption.dog.height && (
            <>
              <dt>Altura:</dt>

              <dd>{adoption.dog.height}cm</dd>
            </>
          )}
          {adoption.dog.color && (
            <>
              <dt>Color:</dt>

              <dd>{adoption.dog.color}</dd>
            </>
          )}
        </dl>
      </section>
    </Form>
  );
}
