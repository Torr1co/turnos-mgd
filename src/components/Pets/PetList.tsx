import React from "react";
import { PetItem } from "~/components/Vet/Clients/PetList";
import Box from "~/components/_common/Box";
import Link from "next/link";
import { type Pet } from ".prisma/client";

export default function PetList({ pets }: { pets: Pet[] }) {
  return (
    <ul className=" mt-8 grid grid-cols-2 gap-8 md:grid-cols-3">
      {pets.length > 0 ? (
        pets.map((pet) => (
          <li key={pet.id} className="group">
            {pet.disabled ? (
              <Box
                size="p-10 rounded-lg cursor-not-allowed"
                className="bg-white "
              >
                <PetItem pet={pet} />
              </Box>
            ) : (
              <Link href={"/pets/" + pet.id}>
                <Box
                  size="p-10 rounded-lg"
                  className="bg-white transition-colors duration-300 group-hover:border-primary"
                >
                  <PetItem pet={pet} />
                </Box>
              </Link>
            )}
          </li>
        ))
      ) : (
        <li className="col-span-3">
          <p className="text-center">No se encontraron perros</p>
        </li>
      )}
    </ul>
  );
}
