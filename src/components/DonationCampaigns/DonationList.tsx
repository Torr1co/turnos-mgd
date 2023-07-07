import React from "react";
import Box from "~/components/_common/Box";
import Text from "~/components/_common/Typo/Text";
import { cn } from "~/utils/styleUtils";
import dayjs from "dayjs";
import { type DonationRelated } from "~/schemas/donationSchema";
import { useSession } from "next-auth/react";
import { isVet } from "~/utils/schemas/usersUtils";

export function DonationItem({ donation }: { donation: DonationRelated }) {
  const { data: session } = useSession();
  return (
    <div>
      <div className="flex flex-col gap-4">
        <Text className={cn("text-gray-500 transition-colors duration-200 ")}>
          <span className="font-semibold"> Dinero donado: </span>
          {donation.amount}
        </Text>
        {isVet(session?.user) && (
          <Text className={cn("text-gray-500 transition-colors duration-200 ")}>
            <span className="font-semibold"> Usuario donante: </span>
            {donation.user
              ? `${donation.user.name} ${donation.user.lastname}`
              : "Anonimo"}
          </Text>
        )}
        <Text className={cn("text-gray-500 transition-colors duration-200 ")}>
          <span className="font-semibold"> Fecha de la donacion: </span>
          {dayjs(donation.createdAt).format("MMMM D, YYYY ")}
        </Text>
      </div>
    </div>
  );
}

export default function DonationList({
  donations,
}: {
  donations: DonationRelated[];
}) {
  return donations.length === 0 ? (
    <div>No se encontraron donaciones a esta campaña</div>
  ) : (
    <ul className="grid  gap-12 md:grid-cols-2">
      {donations.map((Donation) => {
        return (
          <li key={Donation.id} className="h-full">
            <Box className="group flex h-full flex-col gap-8 bg-white">
              <DonationItem donation={Donation} />
            </Box>
          </li>
        );
      })}
    </ul>
  );
}
