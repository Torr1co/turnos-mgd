import React, { useState } from "react";
import { useModal } from "~/context/ModalContex";
import Box from "~/lib/Box";
import Button from "~/lib/Button";
import { PetIcon } from "~/lib/icons";
import Tooltip from "~/lib/Tooltip";
import Text from "~/lib/Typo/Text";
import Title from "~/lib/Typo/Title";
import { type AdoptWithDog } from "~/schemas/adoptPublication";
import { cn } from "~/utils/styles";
import Adopt from "./Adopt";
import AdoptPublicationUpdate from "./AdoptPublicationUpdate";

export function AdoptItem({
  adoption,
  truncate = true,
}: {
  adoption: AdoptWithDog;
  truncate?: boolean;
}) {
  return (
    <div className="flex h-full flex-col gap-8 bg-white">
      <div className="items group flex justify-between">
        <div>
          <PetIcon width="100" height="100" />
        </div>
        <div>
          <Text>{adoption.email}</Text>
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
            {" "}
            {adoption.info}
          </Text>
        )}
        <Text
          className={cn(
            truncate && "truncate-2",
            "text-gray-500 transition-colors duration-200 group-hover:text-primary"
          )}
        >
          {" "}
          {adoption.reason}
        </Text>
      </div>
    </div>
  );
}

export default function AdoptList({
  adoptions,
  mine = false,
}: {
  adoptions: Array<AdoptWithDog>;
  mine?: boolean;
}) {
  const { handleModal } = useModal();
  const [visible, setVisible] = useState("");
  return adoptions.length === 0 ? (
    <div>No se encontraron publicaciones de adopcion</div>
  ) : (
    <ul className="grid grid-cols-2 gap-12">
      {adoptions.map((adoption) => {
        return (
          <li key={adoption.id} className="h-full">
            <Box className="flex h-full flex-col gap-8 bg-white">
              <AdoptItem adoption={adoption} />
              <div className="mt-auto flex gap-4">
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
                    <Tooltip
                      visible={visible === adoption.id}
                      onClickOutside={() => setVisible("")}
                      interactive={true}
                      content={
                        <div className="flex flex-col">
                          Estas seguro?
                          <div className="flex gap-2">
                            <button
                              className="hover:text-primary"
                              onClick={() => setVisible("")}
                            >
                              No
                            </button>
                            <button className="hover:text-primary">Si</button>
                          </div>
                        </div>
                      }
                    >
                      <Button
                        kind={Button.KINDS.gray}
                        onClick={() => setVisible(adoption.id)}
                      >
                        Confirmar Adopcion
                      </Button>
                    </Tooltip>
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
