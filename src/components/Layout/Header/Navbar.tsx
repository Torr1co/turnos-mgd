import React from "react";
import NavLink from "./NavLink";
import NAV_CONFIG from "~/utils/navConfig";

export type NavItem = {
  label: string;
  href: string;
  roles?: Array<string | null>;
  children?: NAV_CONFIG;
};
export type NAV_CONFIG = Record<string, NavItem>;

export default function Navbar() {
  return (
    <nav>
      <ul className="flex items-center gap-5 font-medium">
        <NavLink link={NAV_CONFIG.home} />
        {/* <NavLink link={NAV_CONFIG.services} /> */}
        <NavLink link={NAV_CONFIG.admin} />
        <NavLink link={NAV_CONFIG.dogAssistance} />
      </ul>
    </nav>
  );
}
