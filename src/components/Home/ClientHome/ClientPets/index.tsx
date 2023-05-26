import React, { useState } from "react";
import PetList from "./PetList";
import Title from "~/lib/Typo/Title";
import Input from "~/lib/Form/Input";
import { api } from "~/utils/api";

export default function MyPets() {
  const [filters, setFilters] = useState("");
  const { data: pets = [], isLoading } = api.pets.getAll.useQuery();

  return (
    <section>
      <header className="mb-14 flex items-center justify-between">
        <Title>Mis Perros</Title>
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
