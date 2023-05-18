import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "~/lib/Button";
import { signOut, useSession } from "next-auth/react";
import Navbar from "./Navbar";
import NAV_CONFIG, { LINKS } from "~/utils/navConfig";
import { UserIcon } from "~/lib/icons";
import Tooltip from "~/lib/Tooltip";

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
        <div className="flex gap-4">
          <Tooltip content={session.user.name} className="capitalize">
            <Link href={LINKS.me} className="cursor-pointer">
              <UserIcon width={52} height={52} />
            </Link>
          </Tooltip>
          <Button onClick={() => void signOut()}>Cerrar sesion</Button>
        </div>
      ) : (
        <Link href={NAV_CONFIG.signin.href}>
          <Button>Iniciar Sesion</Button>
        </Link>
      )}
    </header>
  );
}
