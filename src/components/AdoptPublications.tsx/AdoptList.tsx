import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useModal } from "~/context/ModalContex";
import Box from "~/lib/Box";
import Button from "~/lib/Button";
import { PetIcon } from "~/lib/icons";
import Tooltip from "~/lib/Tooltip";
import Text from "~/lib/Typo/Text";
import Title from "~/lib/Typo/Title";
import { type AdoptWithDog } from "~/schemas/adoptionSchema";
import { api } from "~/utils/api";
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
    <div className="flex  flex-col gap-8 bg-white">
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
  const [visible, setVisible] = useState({
    confirm: "",
    delete: "",
  });
  const utils = api.useContext();
  const { mutate: confirm } = api.adoptPublications.confirm.useMutation({
    onSuccess: async () => {
      await utils.adoptPublications.getAll.invalidate();
    },
  });

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
                    <Tooltip
                      visible={visible.confirm === adoption.id}
                      onClickOutside={() =>
                        setVisible((prev) => ({ ...prev, confirm: "" }))
                      }
                      interactive={true}
                      content={
                        <div className="flex flex-col">
                          Estas seguro?
                          <div className="flex gap-2">
                            <button
                              className="hover:text-primary"
                              onClick={() =>
                                setVisible((prev) => ({ ...prev, confirm: "" }))
                              }
                            >
                              No
                            </button>
                            <button
                              className="hover:text-primary"
                              onClick={() => {
                                confirm(adoption.id, {
                                  onSuccess: () => {
                                    setVisible((prev) => ({
                                      ...prev,
                                      confirm: "",
                                    }));
                                    toast.success("Adopcion confirmada");
                                  },
                                });
                              }}
                            >
                              Si
                            </button>
                          </div>
                        </div>
                      }
                    >
                      <Button
                        kind={Button.KINDS.gray}
                        onClick={() =>
                          setVisible((prev) => ({
                            ...prev,
                            confirm: adoption.id,
                          }))
                        }
                      >
                        Completar
                      </Button>
                    </Tooltip>
                    <Tooltip
                      visible={visible.delete === adoption.id}
                      onClickOutside={() =>
                        setVisible((prev) => ({ ...prev, delete: "" }))
                      }
                      interactive={true}
                      content={
                        <div className="flex flex-col">
                          Estas seguro?
                          <div className="flex gap-2">
                            <button
                              className="hover:text-primary"
                              onClick={() =>
                                setVisible((prev) => ({ ...prev, delete: "" }))
                              }
                            >
                              No
                            </button>
                            <button
                              className="hover:text-primary"
                              onClick={() => {
                                confirm(adoption.id, {
                                  onSuccess: () => {
                                    setVisible((prev) => ({
                                      ...prev,
                                      delete: "",
                                    }));
                                    toast.success("Adopcion confirmada");
                                  },
                                });
                              }}
                            >
                              Si
                            </button>
                          </div>
                        </div>
                      }
                    >
                      <Button
                        kind={Button.KINDS.gray}
                        onClick={() =>
                          setVisible((prev) => ({
                            ...prev,
                            delete: adoption.id,
                          }))
                        }
                      >
                        Eliminar
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
