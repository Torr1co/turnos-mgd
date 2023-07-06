import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { type NavItem, isNavWithChildren } from "./Navbar";
import { useRouter } from "next/router";
import { cn } from "~/utils/styleUtils";
import Text from "~/components/_common/Typo/Text";
import Dropdown from "~/components/_common/Dropdown";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";

export default function NavLink({ link }: { link: NavItem }) {
  const { data: session } = useSession();
  const router = useRouter();
  const canAccess =
    !link.roles || link.roles.includes(session?.user.role ?? null);

  const isActive = isNavWithChildren(link)
    ? Object.values(link.children).some((child) => {
        return router.asPath.startsWith(child.href);
      })
    : router.asPath === link.href;

  /* const isActive = link.children
    ? router.asPath.startsWith(link.href)
    : router.asPath === link.href; */
  if (!canAccess) {
    return null;
  }

  if (isNavWithChildren(link)) {
    return (
      <Dropdown className={cn(isActive && "text-primary")} label={link.label}>
        <div className="flex flex-col gap-1">
          {Object.values(link.children)
            .filter((child) => {
              return (
                !child.roles || child.roles.includes(session?.user.role ?? null)
              );
            })
            .map((child) => (
              <Link key={child.href} href={child.href}>
                <Dropdown.Item>
                  <div
                    className={cn(
                      "group-hover:translate-x-2 group-hover:text-primary",
                      "flex items-center gap-1 transition-all duration-300"
                    )}
                  >
                    {child.label}

                    <ArrowSmallRightIcon
                      className={cn(
                        "opacity-0 group-hover:opacity-100",
                        "h-5 w-5 stroke-2 transition-opacity duration-300"
                      )}
                      style={{
                        transform: "rotate(-45deg)",
                      }}
                    />
                  </div>
                </Dropdown.Item>
              </Link>
            ))}
        </div>
      </Dropdown>
    );
  }

  return (
    <li>
      <Link href={link.href}>
        <Text className={cn(isActive && "text-primary")}>{link.label}</Text>
      </Link>
    </li>
  );
}
