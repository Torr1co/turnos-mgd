import React from "react";
import { useModal } from "~/context/ModalContex";
import Box from "~/components/_common/Box";
import Button from "~/components/_common/Button";
import Text from "~/components/_common/Typo/Text";
import { cn } from "~/utils/styleUtils";
import { type DonationCampaign } from "@prisma/client";
import { useSession } from "next-auth/react";
import { isVet } from "~/utils/schemas/usersUtils";
import Image from "next/image";
import Title from "../_common/Typo/Title";
import dayjs from "dayjs";
import DonateModal from "./DonateModal";
// import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
// initMercadoPago("YOUR_PUBLIC_KEY");

export function DonationCampaignItem({
  donationCampaign,
}: {
  donationCampaign: DonationCampaign;
}) {
  const { handleModal } = useModal();
  const { data: session } = useSession();

  return (
    <Box className="flex h-full flex-col gap-8 bg-white">
      <div className="flex flex-col gap-8 bg-white">
        {donationCampaign.img ? (
          <div className="relative h-[200px] w-full">
            <Image
              src={donationCampaign.img}
              alt="donation Campaign photo"
              fill={true}
              className="rounded-md object-cover"
            />
          </div>
        ) : (
          <div></div>
        )}
        <div className="flex flex-col gap-4">
          <Title as="h3">{donationCampaign.title}</Title>
          <Text
            className={cn(
              "truncate-2",
              "text-gray-500 transition-colors duration-200 group-hover:text-primary"
            )}
          >
            <span className="font-semibold"> Razon de la publicacion: </span>
            {donationCampaign.reason}
          </Text>
          <Text
            className={cn(
              "text-gray-500 transition-colors duration-200 group-hover:text-primary"
            )}
          >
            <span className="font-semibold"> Progreso: </span>$
            {donationCampaign.amountGoal - donationCampaign.currentAmount} pesos
            donados de ${donationCampaign.amountGoal} pesos objetivo
          </Text>
          <Text
            className={cn(
              "text-gray-500 transition-colors duration-200 group-hover:text-primary"
            )}
          >
            <span className="font-semibold"> Fecha de fin: </span>
            {dayjs(donationCampaign.endDate).format("MMMM D, YYYY ")}
          </Text>
        </div>
      </div>
      <div className="mt-auto grid gap-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
        {/* <Wallet initialization={{ preferenceId: "<PREFERENCE_ID>" }} />
        <div id="wallet_container"></div> */}
        <Button
          kind={Button.KINDS.gray}
          onClick={() =>
            handleModal(<DonateModal donationCampaign={donationCampaign} />)
          }
        >
          Donar
        </Button>
        {isVet(session?.user) && (
          <>
            <Button kind={Button.KINDS.gray}>Editar</Button>
          </>
        )}
      </div>
    </Box>
  );
}

export default function DonationCampaignList({
  donationCampaigns,
}: {
  donationCampaigns: DonationCampaign[];
}) {
  return donationCampaigns.length === 0 ? (
    <div>No se encontraron publicaciones de adopcion</div>
  ) : (
    <ul className="grid  gap-12 md:grid-cols-2">
      {donationCampaigns.map((donationCampaign) => {
        return (
          <li key={donationCampaign.id} className="h-full">
            <DonationCampaignItem donationCampaign={donationCampaign} />
          </li>
        );
      })}
    </ul>
  );
}
