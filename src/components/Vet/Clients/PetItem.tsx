import React from "react";
import { type Pet } from "@prisma/client";
import { PetIcon } from "~/lib/icons";
import Title from "~/lib/Typo/Title";
import Link from "next/link";
import Text from "~/lib/Typo/Text";

export default function PetItem({ pet }: { pet: Pet }) {
  return (
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
  );
}
