import dayjs from "dayjs";
import React from "react";
import Box from "~/lib/Box";
import Text from "~/lib/Typo/Text";
import Title from "~/lib/Typo/Title";
import { type AdoptWithDog } from "~/schemas/adoptionSchema";
import { api } from "~/utils/api";
import { cn, getDogIcon } from "~/utils/styles";

export function AdoptItem({ adoption }: { adoption: AdoptWithDog }) {
  const PetIcon = getDogIcon(adoption.id);
  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-8 bg-white">
        <div>
          <PetIcon width="76" height="76" />
        </div>
        <div>
          <div className="flex flex-col gap-6">
            {adoption.dog.name !== "" && (
              <Title
                as="h4"
                size="font-semibold"
                className="h-max transition-colors duration-200 truncate group-hover:text-primary"
              >
                {adoption.dog.name}
              </Title>
            )}
          </div>
          <Text
            className={cn(
              "text-gray-500 transition-colors duration-200 group-hover:text-primary"
            )}
          >
            Fue adoptado en ohMyDog el <br />
            {dayjs(adoption.updatedAt).format("DD/MM/YYYY")}
          </Text>
        </div>
      </div>
    </div>
  );
}

export default function AdoptedList() {
  const { data: adoptions = [] } = api.adoptPublications.getAdopted.useQuery();

  return adoptions.length >= 0 ? (
    <ul className="no-scrollbar flex h-full gap-8 overflow-x-auto">
      {adoptions.map((adoption) => {
        return (
          <li key={adoption.id} className="h-full">
            <Box className="w-max bg-white" size="p-8 rounded-md">
              <AdoptItem adoption={adoption} />
            </Box>
          </li>
        );
      })}
    </ul>
  ) : (
    <></>
  );
}
