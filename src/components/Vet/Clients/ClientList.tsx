import React from "react";
import Box from "~/components/_common/Box";
import Button from "~/components/_common/Button";
import Title from "~/components/_common/Typo/Title";
import Text from "~/components/_common/Typo/Text";
import { api } from "~/utils/api";
import { type User, type Pet } from ".prisma/client";
import { useModal } from "~/context/ModalContex";
import PetRegister from "./PetRegister";
import { Transition } from "@headlessui/react";
import { cn } from "~/utils/styleUtils";
import PetList from "./PetList";

export default function ClientList({
  filterFn,
}: {
  filterFn?: (user: User & { dogs: Pet[] }) => boolean;
}) {
  const { data: users = [], isLoading } = api.clients.getAll.useQuery();
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const { handleModal } = useModal();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  const filteredUsers = filterFn ? users.filter(filterFn) : users;
  return (
    <ul className="flex flex-col gap-6">
      {filteredUsers.length === 0 ? (
        <div>No se encontraron clientes</div>
      ) : (
        filteredUsers.map((user) => {
          const isSelected = selectedUser?.id === user.id;
          return (
            <li key={user.id}>
              <Box
                size={cn(
                  "pt-6 px-8 md:px-14 md:pt-10 rounded-lg",
                  isSelected && "pb-8"
                )}
                className="flex flex-col bg-white"
              >
                <div className="flex items-center justify-between pb-8">
                  <div>
                    <Title
                      as="h3"
                      className={cn(
                        isSelected && "text-primary",
                        "capitalize transition-colors duration-300"
                      )}
                    >
                      {user.name} {user.lastname}
                    </Title>
                    <Text>{user.email}</Text>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      className="transition-colos duration-200"
                      kind={
                        isSelected ? Button.KINDS.primary : Button.KINDS.gray
                      }
                      onClick={() => setSelectedUser(isSelected ? null : user)}
                    >
                      Ver Perros
                    </Button>
                    <Button
                      className="transition-colos duration-200"
                      kind={Button.KINDS.gray}
                      onClick={() =>
                        handleModal(<PetRegister ownerId={user.id} />)
                      }
                    >
                      Registrar Perro
                    </Button>
                  </div>
                </div>
                <Transition
                  show={isSelected}
                  className="overflow-auto"
                  enter=" transition transition-all duration-700 ease-out"
                  enterFrom="max-h-[0]"
                  enterTo="max-h-64"
                  leave="transition transition-all duration-500 ease-out"
                  leaveFrom="max-h-64"
                  leaveTo="max-h-0"
                >
                  <PetList pets={user.dogs} />
                </Transition>
              </Box>
            </li>
          );
        })
      )}
    </ul>
  );
}
