import Link from "next/link";
import React from "react";
import Button from "~/components/_common/Button";
import Text from "~/components/_common/Typo/Text";
import Title from "~/components/_common/Typo/Title";
import { LINKS } from "~/utils/navUtils";
// import Map from "../_common/Map/DynamicMap";
import { useSession } from "next-auth/react";
import GoogleMap from "../_common/GoogleMap";
import GoogleMapsProvider from "../_common/GoogleMap/GoogleMapProvider";
import { MAGDALENA_CENTER_LOCATION } from "~/utils/googleMapsUtils";
import Image from "next/image";
export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      <Image
        alt="imagen de fondo"
        src={"/images/homeBG.jpg"}
        fill={true}
        className="min-w-screen -z-10 object-cover"
      />
      <div className="from-90% to-10% absolute -z-10 -mx-8 h-full w-full bg-gradient-to-r from-black p-8 pt-8 md:-mx-20 md:px-20">
        <header className="max-w-[44rem] scale-95">
          <div className="flex flex-col gap-6 text-white">
            <Title as="h1">Ciudad de Magdalena</Title>
            <Text className="text-md">
              Magdalena, una joya escondida en la provincia de Buenos Aires,
              Argentina, es un destino que merece ser explorado. Esta ciudad,
              ubicada a orillas del Río de la Plata, ofrece una mezcla única de
              historia, cultura y belleza natural que la convierte en un lugar
              ideal para tu siguiente destino.
            </Text>
            {session ? (
              <Link href={LINKS.businesses}>
                <Button>Explorar Negocios</Button>
              </Link>
            ) : (
              <Link href={LINKS.signin}>
                <Button>Iniciar Sesion</Button>
              </Link>
            )}
            {/*  <Map
              center={[-35.0818246, -57.5122185]}
              zoom={12.5}
              scrollWheelZoom={false}
              className="relative h-72 w-96"
              zoomControl={false}
              attributionControl={false}
            >
              {({ TileLayer, Polygon }) => {
                return (
                  <>
                    <TileLayer
                      attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`}
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    <Polygon
                      pathOptions={{ color: "lime" }}
                      positions={[
                        [-35.085, -57.51],
                        [-35.08, -57.52],
                        [-35.08, -57.53],
                      ]}
                    />
                  </>
                );
              }}
            </Map> */}
            <GoogleMapsProvider>
              <GoogleMap
                className="h-72 w-96"
                center={MAGDALENA_CENTER_LOCATION}
                zoom={13}
              />
            </GoogleMapsProvider>
          </div>
        </header>
      </div>

      {/* <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <li className="flex items-center gap-8">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-gray-300">
            <EnvelopeIcon className="h-10 w-10 text-gray-600" />
          </div>
          <div>
            <Title as="h3">Contacto</Title>
            <Text className="text-gray-500">v.ohmydog@gmail.com</Text>
            <Text className="text-gray-500">221-1234567</Text>
          </div>
        </li>
        <li className="flex items-center gap-8">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-gray-300">
            <MapPinIcon className="h-10 w-10 text-gray-600" />
          </div>
          <div>
            <Title as="h3">Ubicacion</Title>
            <Text className="text-gray-500">La plata, Buenos Aires</Text>
            <Text className="text-gray-500">Belgrano 150</Text>
          </div>
        </li>
        <li className="flex items-center gap-8">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-gray-300">
            <ClockIcon className="h-10 w-10 text-gray-600" />
          </div>
          <div>
            <Title as="h3">Horarios</Title>
            <Text className="text-gray-500">Lunes a Sabados</Text>
            <Text className="text-gray-500">Mañana a Tarde-Noche</Text>
          </div>
        </li>
      </ul> */}
    </>
  );
}
