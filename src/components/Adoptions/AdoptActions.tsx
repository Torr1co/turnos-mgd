import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { type AdoptWithDog } from "~/schemas/adoptionSchema";
import { api } from "~/utils/api";
import Button from "../_common/Button";
import ConfirmTooltip from "../_common/ConfirmTooltip";

export const CompleteAdoptionButton = ({
  adoption,
}: {
  adoption: AdoptWithDog;
}) => {
  const [visible, setVisible] = useState(false);
  const utils = api.useContext();
  const { mutate: confirm } = api.adoptPublications.confirm.useMutation({
    onSuccess: async () => {
      await utils.adoptPublications.getAll.invalidate();
      await utils.adoptPublications.getAdopted.invalidate();
    },
  });

  return (
    <ConfirmTooltip
      open={visible}
      onReject={() => setVisible(false)}
      onConfirm={() => {
        confirm(adoption.id, {
          onSuccess: () => {
            toast.success("Publicacion marcada como completada");
            setVisible(false);
          },
        });
      }}
    >
      <Button kind={Button.KINDS.gray} onClick={() => setVisible(true)}>
        Completar
      </Button>
    </ConfirmTooltip>
  );
};

export const CancelAdoptionButton = ({
  adoption,
}: {
  adoption: AdoptWithDog;
}) => {
  const [visible, setVisible] = useState(false);
  const utils = api.useContext();
  const { mutate: cancel } = api.adoptPublications.cancel.useMutation({
    onSuccess: async () => {
      await utils.adoptPublications.getAll.invalidate();
      await utils.adoptPublications.getAdopted.invalidate();
    },
  });

  return (
    <ConfirmTooltip
      open={visible}
      onReject={() => setVisible(false)}
      onConfirm={() => {
        cancel(adoption.id, {
          onSuccess: () => {
            toast.success("Publicacion cancelada");
            setVisible(false);
          },
        });
      }}
    >
      <Button kind={Button.KINDS.gray} onClick={() => setVisible(true)}>
        Eliminar
      </Button>
    </ConfirmTooltip>
  );
};
