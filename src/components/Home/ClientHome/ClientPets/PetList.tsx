import React from "react";
import { PetItem } from "~/components/Vet/Clients/PetList";
import Box from "~/lib/Box";
import Link from "next/link";
import { type Pet } from ".prisma/client";

export default function PetList({ pets }: { pets: Pet[] }) {
  return (
    <ul className=" mt-8 grid grid-cols-2 gap-8 md:grid-cols-3">
      {pets.length > 0 ? (
        pets.map((pet) => (
          <li key={pet.id} className="group">
            <Link href={"/pets/" + pet.id}>
              <Box
                size="p-10 rounded-lg"
                className="bg-white transition-colors duration-300 group-hover:border-primary"
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
