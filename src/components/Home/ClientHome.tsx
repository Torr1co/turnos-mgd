import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { LINKS } from "~/utils/navConfig";

export default function ClientHome() {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    console.log(session);
    if (!session?.user.passwordVerified) {
      void router.push(LINKS.newPassword);
    }
  }, [session]);

  return <div>Client Home</div>;
}
