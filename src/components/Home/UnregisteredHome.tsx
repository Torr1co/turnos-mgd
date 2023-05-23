import Link from "next/link";
import React from "react";
import Button from "~/lib/Button";
import Text from "~/lib/Typo/Text";
import Title from "~/lib/Typo/Title";
import NAV_CONFIG from "~/utils/navConfig";

export default function UnregisteredHome() {
  return (
    <div>
      <header className="mb-14 max-w-[44rem] scale-95">
        <div className="flex flex-col gap-6">
          <Title as="h1">
            La veterinaria para conectar con el mundo perruno!
          </Title>
          <Text>
            Somos una veterinaria online que te ofrece todo lo que tu mascota
            necesita para estar sana y feliz. Desde turnos con profesionales
            veterinarios hasta Encontrar perros en adopcion. ¡Todo en un solo
            lugar!
          </Text>
          <Link href={NAV_CONFIG.signin.href}>
            <Button>Iniciar Sesion</Button>
          </Link>
        </div>
      </header>
      <ul>
        <li><div></div></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
}
