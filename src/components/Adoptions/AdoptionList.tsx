import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useModal } from "~/context/ModalContex";
import Box from "~/components/_common/Box";
import Button from "~/components/_common/Button";
import Tooltip from "~/components/_common/Tooltip";
import Text from "~/components/_common/Typo/Text";
import Title from "~/components/_common/Typo/Title";
import { type AdoptWithDog } from "~/schemas/adoptionSchema";
import { api } from "~/utils/api";
import { cn, getDogIcon } from "~/utils/styleUtils";
import Adopt from "./AdoptContact/AdoptContactModal";
import AdoptPublicationUpdate from "./AdoptPublication/AdoptionUpdateModal";
import ConfirmTooltip from "../_common/ConfirmTooltip";

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
  const [visible, setVisible] = useState({
    confirm: "",
    delete: "",
  });
  const utils = api.useContext();
  const { mutate: confirm } = api.adoptPublications.confirm.useMutation({
    onSuccess: async () => {
      await utils.adoptPublications.getAll.invalidate();
      await utils.adoptPublications.getAdopted.invalidate();
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
                    <ConfirmTooltip
                      visible={visible.confirm === adoption.id}
                      onReject={() =>
                        setVisible((prev) => ({ ...prev, confirm: "" }))
                      }
                      onConfirm={() => {
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
                    </ConfirmTooltip>
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
