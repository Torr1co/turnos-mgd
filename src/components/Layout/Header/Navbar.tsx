import React from "react";
import NavLink from "./NavLink";
import NAV_CONFIG from "~/utils/navConfig";

interface NavBaseItem {
  label: string;
  roles?: Array<string | null>;
}

interface NavWithHref extends NavBaseItem {
  href: string;
}

interface NavWithChildren extends NavBaseItem {
  children: {
    [x: string]: NavWithHref;
  };
}

export type NavItem = NavWithChildren | NavWithHref;

export function isNavWithChildren(item: NavItem): item is NavWithChildren {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (item as NavWithChildren)?.children !== undefined;
}
export type NAV_CONFIG = Record<string, NavItem>;

export default function Navbar() {
  return (
    <nav>
      <ul className="flex items-center gap-5 font-medium">
        {Object.values(NAV_CONFIG).map((navItem) => (
          <NavLink key={navItem.label} link={navItem} />
        ))}
      </ul>
    </nav>
  );
}
