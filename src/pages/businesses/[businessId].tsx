import React from "react";
import { type GetServerSideProps } from "next";
import { prisma } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";
import { type BusinessRelated } from "~/schemas/businessSchema";
import Title from "~/components/_common/Typo/Title";
import { businessRouter } from "~/server/api/routers/businessRouter";
import { api } from "~/utils/api";
import Text from "~/components/_common/Typo/Text";
import Button from "~/components/_common/Button";
import Link from "~/components/_common/Link";
import { useModal } from "~/context/ModalContex";
import BookingCreationModal from "~/components/bookings/BookingCreationModal";
import StickyLayout from "~/components/Layout/StickyLayout";
import Image from "next/image";
import GoogleMap from "~/components/_common/GoogleMap";
import { getMapPositionByUrl } from "~/utils/googleMapsUtils";
import GoogleMapsProvider from "~/components/_common/GoogleMap/GoogleMapProvider";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  const trpc = businessRouter.createCaller({ session, prisma });
  try {
    const business = await trpc.getById(ctx.params?.businessId as string);
    return {
      props: {
        business: JSON.stringify(business),
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

type BusinessPageProps = {
  business: string;
};

export default function BusinessPage(props: BusinessPageProps) {
  const businessInitial = JSON.parse(props.business) as BusinessRelated;
  const { data: businessFetching } = api.businesses.getById.useQuery(
    businessInitial.id
  );
  const business = businessFetching ?? businessInitial;
  const { handleModal } = useModal();
  console.log();
  return (
    <div>
      <header className="flex items-center justify-between py-8">
        <Title>
          Negocio: <span className="text-primary">{business.title}</span>
        </Title>
      </header>
      <StickyLayout>
        <div className="flex flex-col gap-6">
          {business.image && (
            <div className="relative w-full">
              <Image
                src={business.image}
                alt={business.title}
                width={1000}
                height={500}
                className="object-cover"
              />
            </div>
          )}
          <Text>{business.desc}</Text>
          <Text>Como llegar: {business.addressDesc}</Text>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <Button
              onClick={() => {
                handleModal(<BookingCreationModal business={business} />);
              }}
            >
              Reservar turno
            </Button>
          </div>
          {business.website && (
            <Link href={business.website} arrow active newPage>
              Pagina oficial
            </Link>
          )}
          {business.address && (
            <>
              <Link href={business.address} arrow active newPage>
                Direccion
              </Link>
              <GoogleMapsProvider>
                <GoogleMap
                  className="h-96 w-full"
                  zoom={14}
                  center={getMapPositionByUrl(business.address)}
                >
                  <GoogleMap.Marker
                    position={getMapPositionByUrl(business.address)}
                  />
                </GoogleMap>
              </GoogleMapsProvider>
            </>
          )}{" "}
        </div>
      </StickyLayout>
    </div>
  );
}
