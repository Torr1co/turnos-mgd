import React from "react";
import { PetItem } from "~/components/Vet/Clients/PetList";
import Box from "~/lib/Box";
import { api } from "~/utils/api";
import Link from "next/link";

export default function PetList() {
  const { data: pets = [] } = api.pets.getAll.useQuery();

  return (
    <ul className=" mt-8 grid grid-cols-3 gap-8">
      {pets.length > 0 ? (
        pets.map((pet) => (
          <li key={pet.id} className="group">
            <Link href={"/pets/" + pet.id}>
              <Box
                size="p-10 rounded-lg"
                className="transition-colors duration-300 group-hover:border-primary"
              >
                <PetItem pet={pet} />
              </Box>
            </Link>
          </li>
        ))
      ) : (
        <li className="col-span-3">
          <p className="text-center">No hay perros registrados</p>
        </li>
      )}
    </ul>
  );
}
