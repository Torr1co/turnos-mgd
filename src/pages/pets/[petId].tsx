import React from "react";
import Title from "~/lib/Typo/Title";
// import Button from "~/lib/Button";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
// import Input from "~/lib/Form/Input";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Box from "~/lib/Box";
import { PetUpdateSchema } from "~/schemas/pet";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Form from "~/lib/Form";
import { toast } from "react-hot-toast";
import { UserRoles } from ".prisma/client";
import PetInformation from "~/components/Vet/Clients/PetInformation";
import PetForm from "~/components/Vet/Clients/ClientRegister/PetForm";
import Button from "~/lib/Button";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (typeof ctx.params?.petId !== "string") {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  return {
    props: { session, petId: ctx.params.petId },
  };
};

const PetPage = ({ petId }: { petId: string }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const methods = useForm<PetUpdateSchema>({
    resolver: zodResolver(PetUpdateSchema),
    defaultValues: {
      petId,
    },
  });
  const { data: pet } = api.pets.get.useQuery(petId, {
    onSuccess: (data) => {
      const { owner, healthBook, img, id, ...dog } = data;
      console.log(dog);
      methods.reset({ petId: id, dog });
    },
    onError: () => {
      void router.push("/404");
    },
  });
  const utils = api.useContext();
  const { mutate: updatePet, isLoading } = api.pets.update.useMutation({
    onSuccess: async () => {
      await utils.pets.get.invalidate();
    },
  });
  if (!pet || !session) return <></>;
  const isVet = session.user.role === UserRoles.VET;
  return (
    <Form
      methods={methods}
      onSubmit={(data) => {
        updatePet(data, {
          onSuccess: () => {
            toast.success("Se actualizo correctamente");
          },
          onError: () => {
            toast.error("Ocurrio un error");
          },
        });
      }}
    >
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
            <PetInformation pet={pet} />
          </div>
        )}
      </Box>
    </Form>
  );
};

export default PetPage;
