import dayjs from "dayjs";
import React from "react";
import Box from "~/components/_common/Box";
import Text from "~/components/_common/Typo/Text";
import Title from "~/components/_common/Typo/Title";
import { type AdoptWithDog } from "~/schemas/adoptionSchema";
import { api } from "~/utils/api";
import { cn, getDogIcon } from "~/utils/styleUtils";

export function AdoptSlideItem({ adoption }: { adoption: AdoptWithDog }) {
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

export default function AdoptSlider() {
  const { data: adopted = [] } = api.adoptPublications.getAdopted.useQuery();

  const triggerSlider = adopted.length >= 5;
  return adopted.length >= 0 ? (
    <div
      className={cn(
        triggerSlider ? "-mx-16 overflow-x-hidden " : "overflow-x-auto"
      )}
    >
      <ul
        className={cn(
          "no-scrollbar flex h-full gap-8",
          triggerSlider && "animate-infiniteScroll"
        )}
      >
        {(triggerSlider ? [...adopted, ...adopted] : adopted).map(
          (adoption) => {
            return (
              <li key={adoption.id} className="h-full">
                <Box className="w-max bg-white" size="p-8 rounded-md">
                  <AdoptSlideItem adoption={adoption} />
                </Box>
              </li>
            );
          }
        )}
      </ul>
    </div>
  ) : (
    <></>
  );
}
