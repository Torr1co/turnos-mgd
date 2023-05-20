import React from "react";
import { type Pet } from "@prisma/client";
import { PetIcon } from "~/lib/icons";
import Title from "~/lib/Typo/Title";
import Link from "next/link";
import Text from "~/lib/Typo/Text";

export default function PetList({ pets }: { pets: Pet[] }) {
  return (
    <ul className=" mt-8 grid grid-cols-3 gap-8">
      {pets.length > 0 ? (
        pets.map((pet) => (
          <li key={pet.id} className="">
            <Link href={"/pets/" + pet.id} className="items group flex gap-10">
              <div>
                <PetIcon width="76" height="76" />
              </div>
              <div>
                <Title
                  as="h4"
                  size="font-semibold"
                  className=" transition-colors duration-200 group-hover:text-primary"
                >
                  {pet.name}
                </Title>
                <Text className="text-gray-500 transition-colors duration-200 truncate-2 group-hover:text-primary">
                  {pet.race}
                </Text>
              </div>
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
