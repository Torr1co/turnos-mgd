import React from "react";
import Title from "~/components/_common/Typo/Title";
import { api } from "~/utils/api";
import BusinessList from "~/components/business/BusinessList";
import { useSession } from "next-auth/react";
import { UserRoles } from "@prisma/client";

const BusinessesPage = () => {
  const { data: session } = useSession();
  const { data: businesses = [], isLoading } = api.businesses.getAll.useQuery();

  return (
    <div>
      {session?.user.role !== UserRoles.OWNER ? (
        <section className="flex flex-col gap-8 py-8">
          <Title>Negocios Adheridos</Title>
          <BusinessList businesses={businesses} isLoading={isLoading} />
        </section>
      ) : (
        <>
          <section className="flex flex-col gap-8 py-8">
            <Title>Mis Negocios</Title>
            <BusinessList
              businesses={businesses.filter((business) => {
                return business.ownerId === session.user.id;
              })}
              isLoading={isLoading}
            />
          </section>
          <section className="flex flex-col gap-8 py-8">
            <Title>Otros Negocios</Title>
            <BusinessList
              businesses={businesses.filter((business) => {
                return business.ownerId !== session.user.id;
              })}
              isLoading={isLoading}
            />
          </section>
        </>
      )}
    </div>
  );
};

export default BusinessesPage;
