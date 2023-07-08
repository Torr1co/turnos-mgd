import React from "react";
import { useModal } from "~/context/ModalContex";
import Button from "~/components/_common/Button";
import { type DonationCampaign } from "@prisma/client";
import { useSession } from "next-auth/react";
import { isVet } from "~/utils/schemas/usersUtils";
import DonationCampaignUpdateModal from "./DonationCampaignUpdateModal";
import { DonationCampaignStatus } from "@prisma/client";
import { api } from "~/utils/api";

const DonationCampaignActions = ({
  donationCampaign,
}: {
  donationCampaign: DonationCampaign;
}) => {
  const { handleModal } = useModal();
  const { data: session } = useSession();
  const utils = api.useContext();
  const { mutate: finishCampaign, isLoading } =
    api.donationCampaigns.finish.useMutation({
      onSuccess: async () => {
        await utils.donationCampaigns.getById.invalidate();
      },
    });
  return (
    <div className="mt-auto grid gap-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
      {isVet(session?.user) &&
        donationCampaign.status === DonationCampaignStatus.ACTIVE && (
          <>
            <Button
              kind={Button.KINDS.gray}
              onClick={() =>
                handleModal(
                  <DonationCampaignUpdateModal
                    donationCampaign={donationCampaign}
                  />
                )
              }
            >
              Editar
            </Button>
            <Button
              loading={isLoading}
              kind={Button.KINDS.gray}
              onClick={() => finishCampaign(donationCampaign.id)}
            >
              Finalizar
            </Button>
          </>
        )}
    </div>
  );
};

export default DonationCampaignActions;
