import React from "react";
import Title from "~/components/_common/Typo/Title";
import Text from "~/components/_common/Typo/Text";
import { type Business } from ".prisma/client";
import { cn } from "~/utils/styleUtils";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import { LINKS } from "~/utils/navUtils";
import NextLink from "next/link";
import Image from "next/image";

export default function BusinessList({
  businesses,
  isLoading = false,
}: {
  businesses: Business[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return <div>Cargando...</div>;
  }
  return (
    <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {businesses.length === 0 ? (
        <div>No se encontraron negocios</div>
      ) : (
        businesses.map((business) => {
          return (
            <li
              key={business.id}
              className="group transition-all duration-300 hover:-translate-y-2"
            >
              <NextLink href={LINKS.businesses + "/" + business.id}>
                <div className={cn("flex flex-col gap-6 ")}>
                  {business.image && (
                    <div className="relative h-60 w-full">
                      <Image
                        src={business.image}
                        alt={business.title}
                        fill={true}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <Title as="h3" className={cn("group-hover:text-primary")}>
                    {business.title}
                  </Title>
                  <Text> {business.desc}</Text>
                  <div className="flex gap-4 text-primary transition-all duration-300 group-hover:translate-x-2">
                    Ver Mas{" "}
                    <ArrowSmallRightIcon
                      className={cn(
                        "h-5 w-5 stroke-2  transition-opacity duration-300"
                      )}
                      style={{
                        transform: "rotate(-45deg)",
                      }}
                    />
                  </div>
                </div>
              </NextLink>
            </li>
          );
        })
      )}
    </ul>
  );
}
