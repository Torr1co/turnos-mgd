import React from "react";
import Title from "~/components/_common/Typo/Title";
import { useModal } from "~/context/ModalContex";
import Button from "~/components/_common/Button";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { UserRoles } from "@prisma/client";
import Input from "~/components/_common/Form/Input";
import Dropdown from "~/components/_common/Dropdown";
import ClientRegisterModal from "~/components/Users/UserRegisterModal";
import ClientList from "~/components/Users/UserList";
import { api } from "~/utils/api";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (session?.user.role !== UserRoles.ADMIN) {
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
  const { data: users = [], isLoading } = api.clients.getAll.useQuery();

  return (
    <div>
      <header className="flex items-center justify-between py-8">
        <Title>Clientes</Title>
        <div className="flex gap-4">
          <Dropdown
            label={<Button kind={Button.KINDS.gray}>Opciones</Button>}
            className="hover:text-primary"
          >
            <div className="flex min-w-[320px] flex-col gap-4">
              <label className="text-base font-medium text-gray-600">
                Filtrar por nombre de cliente o email
              </label>
              <Input
                className="min-w-[260px]"
                placeholder="Buscar por nombre o email"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
          </Dropdown>
          <Button
            kind={Button.KINDS.gray}
            onClick={() => handleModal(<ClientRegisterModal />)}
          >
            Registrar cliente
          </Button>
        </div>
      </header>

      <ClientList
        users={users.filter(
          (user) =>
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.firstname.toLowerCase().includes(search.toLowerCase())
        )}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Clients;
