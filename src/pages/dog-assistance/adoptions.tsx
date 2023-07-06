import React, { useState } from "react";
import Title from "~/components/_common/Typo/Title";
import { useModal } from "~/context/ModalContex";
import Button from "~/components/_common/Button";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import AdoptPublicationCreation from "~/components/Adoptions/AdoptPublication/AdoptCreationModal";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import Toggle from "~/components/_common/Form/Toggle";
import AdoptSlider from "~/components/Adoptions/AdoptSlider";
import AdoptionList from "~/components/Adoptions/AdoptionList";
// import { Switch } from "@headlessui/react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const Adoptions = () => {
  const { handleModal } = useModal();
  const { data: adoptions = [], isLoading } =
    api.adoptPublications.getAll.useQuery();
  const { data: session } = useSession();
  const [mine, setMine] = useState(false);
  return (
    <div>
      <AdoptSlider />
      <header className="my-14 flex items-center justify-between">
        {/* {Mejora este mensaje} */}
        <Title>Perros en adopcion {mine ? "propios" : "ajenos"}</Title>
        <div className="flex gap-4">
          {session && (
            <Toggle
              label="Mis publicaciones"
              checked={mine}
              onChange={() => setMine((prev) => !prev)}
            />
          )}
          {session && (
            <Button
              kind={Button.KINDS.gray}
              className="transition-colors duration-300"
              onClick={() => handleModal(<AdoptPublicationCreation />)}
            >
              Crear publicacion
            </Button>
          )}
        </div>
      </header>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <AdoptionList
          mine={mine}
          adoptions={adoptions.filter((adoption) =>
            mine
              ? adoption.userId === session?.user.id
              : adoption.userId !== session?.user.id
          )}
        />
      )}
    </div>
  );
};

export default Adoptions;
