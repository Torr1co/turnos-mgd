import React from "react";
import Box from "~/components/_common/Box";
import Text from "~/components/_common/Typo/Text";
import { cn } from "~/utils/styleUtils";
import { DonationCampaignStatus, type DonationCampaign } from "@prisma/client";
import Image from "next/image";
import Title from "../_common/Typo/Title";
import dayjs from "dayjs";
import Link from "next/link";
import { LINKS } from "~/utils/navConfig";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";

export function DonationCampaignItem({
  truncate = true,
  donationCampaign,
}: {
  donationCampaign: DonationCampaign;
  truncate?: boolean;
}) {
  return (
    <div>
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
        <Title
          as="h3"
          className="transition-colors duration-300 group-hover:text-primary"
        >
          {donationCampaign.title}{" "}
          {donationCampaign.status === DonationCampaignStatus.FINISHED &&
            "(Finalizada)"}
        </Title>
        <Text
          className={cn(
            truncate && "truncate-2",
            "text-gray-500 transition-colors duration-200 "
          )}
        >
          <span className="font-semibold"> Razon de la publicacion: </span>
          {donationCampaign.reason}
        </Text>
        <Text className={cn("text-gray-500 transition-colors duration-200 ")}>
          <span className="font-semibold"> Progreso: </span>$
          {donationCampaign.currentAmount} pesos donados de $
          {donationCampaign.amountGoal} pesos objetivo
        </Text>
        <Text className={cn("text-gray-500 transition-colors duration-200 ")}>
          <span className="font-semibold"> Fecha de fin: </span>
          {dayjs(donationCampaign.endDate).format("MMMM D, YYYY ")}
        </Text>
      </div>
    </div>
  );
}

export default function DonationCampaignList({
  donationCampaigns,
}: {
  donationCampaigns: DonationCampaign[];
}) {
  return donationCampaigns.length === 0 ? (
    <div>No se encontraron campañas de donacion</div>
  ) : (
    <ul className="grid  gap-12 md:grid-cols-2">
      {donationCampaigns.map((donationCampaign) => {
        return (
          <li key={donationCampaign.id} className="h-full">
            <Link href={LINKS.donationCampaign(donationCampaign.id)}>
              <Box className="group flex h-full flex-col gap-8 bg-white transition-all duration-300 hover:-translate-y-2 hover:border-primary">
                <DonationCampaignItem donationCampaign={donationCampaign} />

                <div
                  className={cn(
                    "group-hover:translate-x-2 group-hover:text-primary",
                    "flex items-center gap-1 font-semibold transition-all duration-300"
                  )}
                >
                  Ver mas
                  <ArrowSmallRightIcon
                    className={cn(
                      "opacity-0 group-hover:opacity-100",
                      "h-5 w-5 stroke-2 transition-opacity duration-300"
                    )}
                    style={{
                      transform: "rotate(-45deg)",
                    }}
                  />
                </div>
              </Box>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
