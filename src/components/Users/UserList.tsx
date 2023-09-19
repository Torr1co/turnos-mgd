import React from "react";
import Button from "~/components/_common/Button";
import Title from "~/components/_common/Typo/Title";
import Text from "~/components/_common/Typo/Text";
import { type User } from ".prisma/client";
import { useModal } from "~/context/ModalContex";
import { cn } from "~/utils/styleUtils";
import BusinessRegisterModal from "../business/BusinessRegisterModal";

export default function UsersList({
  users,
  isLoading = false,
}: {
  users: User[];
  isLoading?: boolean;
}) {
  const { handleModal } = useModal();

  if (isLoading) {
    return <div>Cargando...</div>;
  }
  return (
    <ul className="flex flex-col">
      {users.length === 0 ? (
        <div>No se encontraron clientes</div>
      ) : (
        users.map((user) => {
          return (
            <li key={user.id}>
              <div className={cn("py-6", "flex flex-col border-b")}>
                <div className="flex items-center justify-between">
                  <div>
                    <Title
                      as="h3"
                      className={cn(
                        "capitalize transition-colors duration-300"
                      )}
                    >
                      {user.firstname} {user.lastname}
                    </Title>
                    <Text>{user.email}</Text>
                  </div>
                  <div className="flex gap-4">
                    <Button kind={Button.KINDS.gray}>Ver Mas</Button>
                    <Button
                      kind={Button.KINDS.gray}
                      onClick={() =>
                        handleModal(<BusinessRegisterModal ownerId={user.id} />)
                      }
                    >
                      Registrar Negocio
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          );
        })
      )}
    </ul>
  );
}
