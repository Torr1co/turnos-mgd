import React from "react";
import Title from "~/lib/Typo/Title";
import { useModal } from "~/context/ModalContex";
import ClientList from "~/components/Vet/Clients/ClientList";
import ClientRegister from "~/components/Vet/Clients/ClientRegister";
import Button from "~/lib/Button";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { UserRoles } from "@prisma/client";
import Input from "~/lib/Form/Input";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (session?.user.role !== UserRoles.VET) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
};

const Clients = () => {
  const { handleModal } = useModal();
  const [search, setSearch] = React.useState("");

  return (
    <div>
      <header className="mb-14 flex items-center justify-between">
        <Title>Clientes</Title>
        <div className="flex gap-4">
          <Input
            placeholder="Buscar por nombre o email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <Button
            kind={Button.KINDS.gray}
            onClick={() => handleModal(<ClientRegister />)}
          >
            Registrar cliente
          </Button>
        </div>
      </header>
      <ClientList
        filterFn={(user) => {
          return (
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.name.toLowerCase().includes(search.toLowerCase())
          );
        }}
      />
    </div>
  );
};

export default Clients;
