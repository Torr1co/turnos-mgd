import React from "react";
import Title from "~/lib/Typo/Title";
import { useModal } from "~/context/ModalContex";
import ClientList from "~/components/Vet/Clients/ClientList";
import ClientRegister from "~/components/Vet/Clients/ClientRegister";
import Button from "~/lib/Button";

const Clients = () => {
  const { handleModal } = useModal();

  return (
    <div>
      <header className="mb-14 flex items-center justify-between">
        <Title>Clientes</Title>
        <div>
          <Button
            kind={Button.KINDS.gray}
            onClick={() => handleModal(<ClientRegister />)}
          >
            Registrar cliente
          </Button>
        </div>
      </header>
      <ClientList />
    </div>
  );
};

export default Clients;
