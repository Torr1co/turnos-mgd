import React from "react";
import Title from "~/lib/Typo/Title";
// import Button from "~/lib/Button";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
// import Input from "~/lib/Form/Input";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (typeof ctx.params?.petId !== "string") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
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
  return (
    <div>
      <header className="mb-14 flex items-center justify-between">
        <Title>{pet?.name}</Title>
      </header>
    </div>
  );
};

export default PetPage;
