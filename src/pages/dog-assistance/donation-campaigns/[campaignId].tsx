import React from "react";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { donationCampaignsRouter } from "~/server/api/routers/donationsRouter";
import { prisma } from "~/server/db";
import { DonationCampaignItem } from "~/components/DonationCampaigns/DonationCampaignList";
import { type DonationCampaign } from "@prisma/client";
import Box from "~/components/_common/Box";
import DonationCampaignActions from "~/components/DonationCampaigns/DonationCampaignActions";
import Title from "~/components/_common/Typo/Title";
import DonateModal from "~/components/DonationCampaigns/DonateModal";
import DonationList from "~/components/DonationCampaigns/DonationList";
import { useSession } from "next-auth/react";
import { isVet } from "~/utils/schemas/usersUtils";
import { DonationCampaignStatus } from "@prisma/client";
import { api } from "~/utils/api";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (typeof ctx.params?.campaignId !== "string") {
    return {
      redirect: {
        destination: "/404",
        permanent: true,
      },
    };
  }

  try {
    const trpc = donationCampaignsRouter.createCaller({ session, prisma });
    const donationCampaign = await trpc.getById(ctx.params.campaignId);
    if (!donationCampaign) throw new Error("Campaña no encontrada");
    return {
      props: {
        session,
        campaign: JSON.stringify(donationCampaign),
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

interface CampaignPageProps {
  campaign: string;
}

// TODO: convert donation campaign to context
export default function CampaignPage(props: CampaignPageProps) {
  const { data: campaign } = api.donationCampaigns.getById.useQuery(
    (JSON.parse(props.campaign) as DonationCampaign).id
  );
  const { data: session } = useSession();
  if (!campaign) return null;
  return (
    <div>
      <header className="mb-14 flex items-center justify-between">
        <Title>Campaña de donacion</Title>
      </header>
      <div className="grid grid-cols-2 gap-8">
        <Box className=" bg-white">
          <DonationCampaignItem donationCampaign={campaign} truncate={false} />
          {isVet(session?.user) &&
            campaign.status === DonationCampaignStatus.ACTIVE && (
              <>
                <hr className="mt-4 py-4" />
                <DonationCampaignActions donationCampaign={campaign} />
              </>
            )}
        </Box>
        <Box className="h-fit bg-white">
          <DonateModal donationCampaign={campaign} />
        </Box>
      </div>
      {!!session?.user && (
        <>
          <header className="my-14 flex items-center justify-between">
            <Title>Donaciones realizadas</Title>
          </header>
          <DonationList donations={campaign.donations} />
        </>
      )}
    </div>
  );
}
