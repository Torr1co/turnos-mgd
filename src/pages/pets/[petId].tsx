import React from "react";
import Title from "~/components/_common/Typo/Title";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";
import Box from "~/components/_common/Box";
import { type PetRelated, PetUpdateSchema } from "~/schemas/petSchema";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Form from "~/components/_common/Form";
import { toast } from "react-hot-toast";
import { UserRoles } from ".prisma/client";
import PetInfo from "~/components/Vet/Clients/PetInfo";
import PetForm from "~/components/Vet/Clients/ClientRegister/PetForm";
import Button from "~/components/_common/Button";
import { petsRouter } from "~/server/api/routers/petsRouter";
import { prisma } from "~/server/db";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (typeof ctx.params?.petId !== "string" || !session) {
    return {
      redirect: {
        destination: "/404",
        permanent: true,
      },
    };
  }

  try {
    const trpc = petsRouter.createCaller({ session, prisma });
    const pet = await trpc.get(ctx.params.petId);
    return {
      props: {
        session,
        pet: JSON.stringify(pet),
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

const PetPage = (props: { pet: string }) => {
  const { owner, healthBook, ...pet } = JSON.parse(props.pet) as PetRelated;
  const { img, id, ...petData } = pet;
  const { data: session } = useSession();
  const methods = useForm<PetUpdateSchema>({
    resolver: zodResolver(PetUpdateSchema),
    defaultValues: {
      petId: id,
      dog: {
        ...petData,
        birth: new Date(petData.birth),
        img: img ?? undefined,
      },
    },
  });
  const { mutate: updatePet, isLoading } = api.pets.update.useMutation();

  if (!session) return <></>;
  const isVet = session.user.role === UserRoles.VET;
  return (
    <Form
      methods={methods}
      className="flex flex-col gap-12"
      onSubmit={(data) => {
        updatePet(data, {
          onSuccess: () => {
            toast.success("Se actualizo correctamente");
          },
          onError: () => {
            toast.error("Ya tiene un perro con ese nombre!");
          },
        });
      }}
    >
      <section>
        <header className="mb-14 flex items-center justify-between">
          <Title>
            Datos del <span className="capitalize">Perro</span>
          </Title>
        </header>
        <Box className=" bg-white">
          {isVet ? (
            <div>
              <PetForm />
              <Button type="submit" loading={isLoading} className="mt-6">
                Actualizar
              </Button>
            </div>
          ) : (
            <div>
              <PetInfo pet={pet} />
            </div>
          )}
        </Box>
      </section>
    </Form>
  );
};

export default PetPage;
