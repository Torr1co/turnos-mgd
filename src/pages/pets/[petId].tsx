import React from "react";
import Title from "~/lib/Typo/Title";
// import Button from "~/lib/Button";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
// import Input from "~/lib/Form/Input";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import Box from "~/lib/Box";
import { GenderOptions } from "~/schemas/pet";
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

const PetPage = (props: { petId: string }) => {
  const router = useRouter();
  const { data: pet } = api.pets.get.useQuery(props.petId, {
    onError: () => {
      void router.push("/404");
    },
  });

  if (!pet) return <></>;

  return (
    <div>
      <header className="mb-14 flex items-center justify-between">
        <Title>
          Datos de <span className="capitalize">{pet.name}</span>
        </Title>
      </header>
      <Box className=" bg-white">
        <dl className="grid grid-cols-2 gap-6">
          <dt>Fecha de Nacimiento:</dt>
          <dd>{dayjs(pet.birth).format("DD/MM/YYYY")}</dd>

          <dt>Genero:</dt>
          <dd>
            {GenderOptions.find((gender) => gender.value === pet.gender)?.label}
          </dd>

          <dt>Raza:</dt>
          <dd>{pet.race}</dd>
          <dt>Peso (en kg):</dt>
          <dd>{pet.weight}</dd>
          <dt>Altura (en cm):</dt>
          <dd>{pet.height}</dd>
          <dt>Color:</dt>
          <dd>{pet.color}</dd>
          <dt>Se encuentra castrado?:</dt>
          <dd>{pet.castrated ? "Si" : "No"}</dd>
          <dt>Observaciones:</dt>
          <dd>{pet.observations}</dd>
        </dl>
        {/* <Form.Input path="dog.img" label="Foto" type="file" /> */}
      </Box>
    </div>
  );
};

export default PetPage;
