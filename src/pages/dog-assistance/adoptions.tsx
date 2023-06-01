import React, { useState } from "react";
import Title from "~/components/_common/Typo/Title";
import { useModal } from "~/context/ModalContex";
import Button from "~/components/_common/Button";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import AdoptList from "~/components/Adoptions/AdoptionList";
import AdoptPublicationCreation from "~/components/Adoptions/AdoptPublication/AdoptCreationModal";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import Toggle from "~/components/_common/Form/Toggle";
import AdoptedList from "~/components/Adoptions/AdoptSlider";
import Dropdown from "~/components/_common/Dropdown";
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
      <AdoptedList />
      <header className="my-14 flex items-center justify-between">
        <Title>Perros de adopcion</Title>
        <div className="flex gap-4">
          {session && (
            <Dropdown
              label={<Button kind={Button.KINDS.gray}>Opciones</Button>}
            >
              <Toggle
                label="Mis publicaciones"
                checked={mine}
                onChange={() => setMine((prev) => !prev)}
              />
            </Dropdown>
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
        <AdoptList
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
