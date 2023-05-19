import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "~/lib/Button";
import { signOut, useSession } from "next-auth/react";
import Navbar from "./Navbar";
import NAV_CONFIG from "~/utils/navConfig";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="z-30 flex items-center justify-between px-10 py-5">
      <Link href={"/"}>
        <figure className="flex flex-col items-center">
          <Image src={"/logo.png"} alt="Logo.png" width={70} height={45} />
          <figcaption className="text-base font-bold text-neutral-600">
            !Oh my dog!
          </figcaption>
        </figure>
      </Link>
      <Navbar />
      {session ? (
        <Button onClick={() => void signOut()}>Cerrar sesion</Button>
      ) : (
        <Link href={NAV_CONFIG.signin.href}>
          <Button>Iniciar Sesion</Button>
        </Link>
      )}
    </header>
  );
}
