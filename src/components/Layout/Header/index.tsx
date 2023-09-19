import React from "react";
import Link from "next/link";
import Button from "~/components/_common/Button";
import { useSession } from "next-auth/react";
import Navbar from "./Navbar";
import { LINKS } from "~/utils/navUtils";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-primary bg-white px-8 py-5 md:px-20">
      <Link href={"/"} className="text-lg font-medium text-primary">
        <span className="font-semibold">Magdalena Digital</span>
      </Link>
      <div className="flex items-center gap-5">
        <Navbar />
        {!session && (
          <Link href={LINKS.signin}>
            <Button>Iniciar Sesion</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
