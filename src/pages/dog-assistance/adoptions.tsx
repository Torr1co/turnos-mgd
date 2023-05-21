import React, { useState } from "react";
import Title from "~/lib/Typo/Title";
import { useModal } from "~/context/ModalContex";
import Button from "~/lib/Button";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import AdoptList from "~/components/AdoptPublications.tsx/AdoptList";
import AdoptPublicationCreation from "~/components/AdoptPublications.tsx/AdoptPublicationCreation";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const Adoptions = () => {
  const { handleModal } = useModal();
  const [mine, setMine] = useState(true);
  const { data: adoptions = [] } = api.adoptPublications.getAll.useQuery();
  const { data: session } = useSession();
  return (
    <div>
      <header className="mb-14 flex items-center justify-between">
        <Title>Perros de adopcion</Title>
        <div className="flex gap-4">
          {session && (
            <Button
              className="transition-colors duration-300"
              kind={mine ? Button.KINDS.primary : Button.KINDS.gray}
              onClick={() => setMine((prev) => !prev)}
            >
              Mis publicaciones
            </Button>
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
      <AdoptList adoptions={adoptions} />
    </div>
  );
};

export default Adoptions;
