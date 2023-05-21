import { type AdoptPublication } from "@prisma/client";
import React from "react";
import Box from "~/lib/Box";

export default function AdoptList({
  adoptions,
}: {
  adoptions: AdoptPublication[];
}) {
  return adoptions.length === 0 ? (
    <div>No se encontraron publicaciones de adopcion</div>
  ) : (
    <ul>
      {adoptions.map((adoption) => {
        return (
          <li key={adoption.id}>
            <Box>Asdasd</Box>
          </li>
        );
      })}
    </ul>
  );
}
