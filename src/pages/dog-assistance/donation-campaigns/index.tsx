import React from "react";
import { useModal } from "~/context/ModalContex";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Title from "~/components/_common/Typo/Title";
import Button from "~/components/_common/Button";
import DonationCreationModal from "~/components/DonationCampaigns/DonationCampaignCreationModal";
import DonationCampaignList from "~/components/DonationCampaigns/DonationCampaignList";
import { isVet } from "~/utils/schemas/usersUtils";

const DonationCampaigns = () => {
  const { handleModal } = useModal();
  const { data: donationCampaigns = [], isLoading } =
    api.donationCampaigns.getAll.useQuery();
  const { data: session } = useSession();
  return (
    <div>
      <header className="my-14 flex items-center justify-between">
        {/* {Mejora este mensaje} */}
        <Title>Publicaciones de donacion</Title>
        <div className="flex gap-4">
          {isVet(session?.user) && (
            <Button
              kind={Button.KINDS.gray}
              className="transition-colors duration-300"
              onClick={() => handleModal(<DonationCreationModal />)}
            >
              Crear publicacion
            </Button>
          )}
        </div>
      </header>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <DonationCampaignList donationCampaigns={donationCampaigns} />
      )}
    </div>
  );
};

export default DonationCampaigns;
