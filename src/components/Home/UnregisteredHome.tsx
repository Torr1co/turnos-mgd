import {
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";
import Button from "~/components/_common/Button";
import Text from "~/components/_common/Typo/Text";
import Title from "~/components/_common/Typo/Title";
import { LINKS } from "~/utils/navConfig";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function UnregisteredHome() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <>
      {!session && router.pathname === "/" && (
        <div className="relative -z-10 -mx-20 -mt-40 h-[88vh]  overflow-hidden rounded-b-[15%] bg-primary-200 px-20 pt-48 pb-16">
          <header className="mb-32 max-w-[44rem] scale-95">
            <div className="flex flex-col gap-6">
              <Title as="h1">
                La veterinaria para conectar con el mundo perruno!
              </Title>
              <Text>
                Somos una veterinaria online que te ofrece todo lo que tu
                mascota necesita para estar sana y feliz. Desde turnos con
                veterinarios profesionales hasta Encontrar perros en adopcion.
                ¡Todo en un solo lugar!
              </Text>
              <Link href={LINKS.signin}>
                <Button>Iniciar Sesion</Button>
              </Link>
            </div>
          </header>
          <div className="absolute bottom-0 right-0 h-[30vw] w-[45vw] md:-bottom-10 md:w-[35vw]">
            <Image
              src="/hero.png"
              fill={true}
              alt="hero"
              className="object-contain"
              style={{
                transform: "scaleX(-1)",
              }}
            />
          </div>
        </div>
      )}

      <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
      </ul>
    </>
  );
}
