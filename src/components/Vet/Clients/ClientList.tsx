import React from "react";
import Box from "~/lib/Box";
import Button from "~/lib/Button";
import Title from "~/lib/Typo/Title";
import Text from "~/lib/Typo/Text";
import { api } from "~/utils/api";
import { type User } from ".prisma/client";
import { useModal } from "~/context/ModalContex";
import PetRegister from "./PetRegister";
import { Transition } from "@headlessui/react";
import PetItem from "./PetItem";
import { cn } from "~/utils/styles";

export default function ClientList({ filter = "" }: { filter?: string }) {
  const { data: users = [], isLoading } = api.clients.getAll.useQuery();
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const { handleModal } = useModal();
  return (
    <ul className="flex flex-col gap-6">
      {isLoading ? (
        <li>Cargando...</li>
      ) : (
        users
          .filter(
            (user) => user.email.includes(filter) || user.name.includes(filter)
          )
          .map((user) => {
            const isSelected = selectedUser?.id === user.id;
            return (
              <li key={user.id}>
                <Box size="lgX" className="flex flex-col bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <Title
                        as="h3"
                        className={cn(
                          isSelected && "text-primary",
                          "capitalize transition-colors duration-300"
                        )}
                      >
                        {user.name}
                      </Title>
                      <Text>{user.email}</Text>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        className="transition-colos duration-200"
                        kind={Button.KINDS.gray}
                        onClick={() =>
                          handleModal(<PetRegister ownerId={user.id} />)
                        }
                      >
                        Registrar Perro
                      </Button>
                      <Button
                        className="transition-colos duration-200"
                        kind={
                          isSelected ? Button.KINDS.primary : Button.KINDS.gray
                        }
                        onClick={() =>
                          setSelectedUser(isSelected ? null : user)
                        }
                      >
                        Ver Perros
                      </Button>
                    </div>
                  </div>
                  <Transition
                    show={isSelected}
                    className="overflow-hidden"
                    enter=" transition transition-all duration-700 ease-out"
                    enterFrom="max-h-[0]"
                    enterTo="max-h-72"
                    leave="transition transition-all duration-500 ease-out"
                    leaveFrom="max-h-72"
                    leaveTo="max-h-0"
                  >
                    <ul className=" mt-8 grid grid-cols-3 gap-8">
                      {user.dogs.length > 0 ? (
                        user.dogs.map((pet) => (
                          <li key={pet.id} className="">
                            <PetItem pet={pet} />
                          </li>
                        ))
                      ) : (
                        <li className="col-span-3">
                          <p className="text-center">
                            No hay perros registrados
                          </p>
                        </li>
                      )}
                    </ul>
                  </Transition>
                </Box>
              </li>
            );
          })
      )}
    </ul>
  );
}
