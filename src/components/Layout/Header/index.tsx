import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "~/components/_common/Button";
import { signOut, useSession } from "next-auth/react";
import Navbar from "./Navbar";
import { LINKS } from "~/utils/navConfig";
import { UserIcon } from "~/components/_common/icons";
import Tooltip from "~/components/_common/Tooltip";
import { useRouter } from "next/router";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
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
          <div className="group cursor-pointer">
            <Tooltip content={session.user.name} className="capitalize">
              <Link
                href={LINKS.me}
                className="relative top-0 transition-all duration-200 group-hover:-top-1"
              >
                <UserIcon width={52} height={52} />
              </Link>
            </Tooltip>
          </div>
          <Button
            onClick={() => {
              void signOut().then(() => router.push("/"));
            }}
          >
            Cerrar sesion
          </Button>
        </div>
      ) : (
        <Link href={LINKS.signin}>
          <Button>Iniciar Sesion</Button>
        </Link>
      )}
    </header>
  );
}
