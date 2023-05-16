import React from "react";
import Box from "~/lib/Box";
import Button from "~/lib/Button";
import Title from "~/lib/Typo/Title";
import { api } from "~/utils/api";
import { type User } from ".prisma/client";

export default function ClientList({ filter = "" }: { filter?: string }) {
  const { data: users = [], isLoading } = api.users.getAll.useQuery();
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

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
                <Box
                  size="lgX"
                  className="flex items-center justify-between bg-white"
                >
                  <div>
                    <Title as="h4">{user.name}</Title>
                    <p>{user.email}</p>
                  </div>
                  <Button
                    className="transition-colos duration-200"
                    kind={isSelected ? Button.KINDS.primary : Button.KINDS.gray}
                    onClick={() => setSelectedUser(isSelected ? null : user)}
                  >
                    Ver Perros
                  </Button>
                </Box>
              </li>
            );
          })
      )}
    </ul>
  );
}
