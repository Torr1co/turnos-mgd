import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "~/lib/Button";

export default function Header() {
  return (
    <header className="z-30">
      <nav className="flex items-center justify-between px-10 py-5">
        <Link href={"/"}>
          <figure className="flex flex-col items-center">
            <Image src={"/logo.png"} alt="Logo.png" width={70} height={45} />
            <figcaption className="text-base font-bold text-neutral-600">
              !Oh my dog!
            </figcaption>
          </figure>
        </Link>
        <ul className="flex items-center gap-5 font-medium">
          <li>
            <Link href="/">Inicio</Link>
          </li>
          <li>
            <Link href="/">Cuida a tus mascotas</Link>
          </li>
          <li>
            <Link href="/">Asistencia de perros</Link>
          </li>
        </ul>
        <Link href="/auth/signIn">
          <Button>Iniciar Sesion</Button>
        </Link>
      </nav>
    </header>
  );
}
