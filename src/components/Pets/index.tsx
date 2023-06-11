import React, { useState } from "react";
import PetList from "./PetList";
import Title from "~/components/_common/Typo/Title";
import Input from "~/components/_common/Form/Input";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { UserRoles } from "@prisma/client";

export default function Pets() {
  const { data: session } = useSession();
  const [filters, setFilters] = useState("");
  const { data: pets = [], isLoading } = api.pets.getAll.useQuery();

  return (
    <section>
      <header className="mb-14 flex items-center justify-between">
        <Title>{session?.user.role === UserRoles.CLIENT && "Mis "}Perros</Title>
        <div className="flex gap-4">
          <Input
            placeholder="Buscar por nombre"
            onChange={(e) => {
              setFilters(e.target.value);
            }}
          />
        </div>
      </header>

      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <PetList
          pets={pets.filter((pets) =>
            pets.name.toLowerCase().includes(filters.toLowerCase())
          )}
        />
      )}
    </section>
  );
}
