import React from "react";
import { useModal } from "~/context/ModalContex";
import Box from "~/components/_common/Box";
import Button from "~/components/_common/Button";
import Text from "~/components/_common/Typo/Text";
import Title from "~/components/_common/Typo/Title";
import { type AdoptWithDog } from "~/schemas/adoptionSchema";
import { cn, getDogIcon } from "~/utils/styleUtils";
import Adopt from "./AdoptContact/AdoptContactModal";
import AdoptPublicationUpdate from "./AdoptPublication/AdoptionUpdateModal";
import { CancelAdoptionButton, CompleteAdoptionButton } from "./AdoptActions";

export function AdoptItem({
  adoption,
  truncate = true,
}: {
  adoption: AdoptWithDog;
  truncate?: boolean;
}) {
  const PetIcon = getDogIcon(adoption.id);
  return (
    <div className="flex  flex-col gap-8 bg-white">
      <div className="items group flex justify-between">
        <div>
          <PetIcon width="100" height="100" />
        </div>
        <div className="text-right">
          <Text className="font-semibold">Informacion de contacto:</Text>
          <Text className="max-w-xs break-words">{adoption.email}</Text>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {adoption.dog.name !== "" && (
          <Title
            as="h2"
            className="h-max transition-colors duration-200 truncate group-hover:text-primary"
          >
            {adoption.dog.name}
          </Title>
        )}
        {adoption.info && (
          <Text
            className={cn(
              truncate && "truncate-3",
              "text-gray-500 transition-colors duration-200 group-hover:text-primary"
            )}
          >
            <span className="font-semibold"> Informacion del perro: </span>
            {adoption.info}
          </Text>
        )}
        <Text
          className={cn(
            truncate && "truncate-2",
            "text-gray-500 transition-colors duration-200 group-hover:text-primary"
          )}
        >
          <span className="font-semibold"> Razon de la publicacion: </span>
          {adoption.reason}
        </Text>
      </div>
    </div>
  );
}

export default function AdoptionList({
  adoptions,
  mine = false,
}: {
  adoptions: Array<AdoptWithDog>;
  mine?: boolean;
}) {
  const { handleModal } = useModal();

  return adoptions.length === 0 ? (
    <div>No se encontraron publicaciones de adopcion</div>
  ) : (
    <ul className="grid  gap-12 md:grid-cols-2">
      {adoptions.map((adoption) => {
        return (
          <li key={adoption.id} className="h-full">
            <Box className="flex h-full flex-col gap-8 bg-white">
              <AdoptItem adoption={adoption} />
              <div className="mt-auto grid gap-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                {mine ? (
                  <>
                    <Button
                      kind={Button.KINDS.gray}
                      onClick={() =>
                        handleModal(
                          <AdoptPublicationUpdate adoption={adoption} />
                        )
                      }
                    >
                      Editar
                    </Button>
                    <CompleteAdoptionButton adoption={adoption} />
                    <CancelAdoptionButton adoption={adoption} />
                  </>
                ) : (
                  <Button
                    kind={Button.KINDS.gray}
                    onClick={() => handleModal(<Adopt adoption={adoption} />)}
                  >
                    Adoptar
                  </Button>
                )}
              </div>
            </Box>
          </li>
        );
      })}
    </ul>
  );
}
