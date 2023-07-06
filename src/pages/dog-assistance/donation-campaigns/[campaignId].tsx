import React from "react";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { donationCampaignsRouter } from "~/server/api/routers/donationsRouter";
import { prisma } from "~/server/db";
import { DonationCampaignItem } from "~/components/DonationCampaigns/DonationCampaignList";
import { type DonationCampaign, type Donation } from "@prisma/client";
import Box from "~/components/_common/Box";
import DonationCampaignActions from "~/components/DonationCampaigns/DonationCampaignActions";
import Title from "~/components/_common/Typo/Title";
import DonateModal from "~/components/DonationCampaigns/DonateModal";
import DonationList from "~/components/DonationCampaigns/DonationList";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (typeof ctx.params?.campaignId !== "string" || !session) {
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

// TODO: convert to context
export default function CampaignPage(props: CampaignPageProps) {
  const campaign = JSON.parse(props.campaign) as DonationCampaign & {
    donations: Donation[];
  };
  return (
    <div>
      <header className="mb-14 flex items-center justify-between">
        <Title>Campaña de donacion</Title>
      </header>
      <div className="grid grid-cols-2 gap-8">
        <Box className=" bg-white">
          <DonationCampaignItem donationCampaign={campaign} />
          <hr className="mt-4 py-4" />
          <DonationCampaignActions donationCampaign={campaign} />
        </Box>
        <Box className=" bg-white">
          <DonateModal donationCampaign={campaign} />
        </Box>
      </div>
      <header className="my-14 flex items-center justify-between">
        <Title>Donaciones realizadas</Title>
      </header>
      <DonationList donations={campaign.donations} />
    </div>
  );
}
