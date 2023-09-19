import React from "react";
import NextLink from "next/link";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import { cn } from "~/utils/styleUtils";

type CustomLinkProps = Parameters<typeof NextLink>[0] & {
  active?: boolean;
  arrow?: boolean;
  newPage?: boolean;
};
export default function Link({
  active = false,
  arrow = false,
  newPage,
  children,
  className,
  ...props
}: CustomLinkProps) {
  return (
    <NextLink
      {...props}
      target={newPage ? "_blank" : ""}
      className={cn(className, "block w-fit")}
    >
      <div className="group font-custom">
        <div
          className={cn(
            "group-hover:translate-x-2 group-hover:text-primary",
            active && "text-primary",
            "flex items-center gap-1 transition-all duration-300"
          )}
        >
          {children}

          {arrow && (
            <ArrowSmallRightIcon
              className={cn(
                "opacity-0 group-hover:opacity-100",
                active && "opacity-100",
                "h-5 w-5 stroke-2 transition-opacity duration-300"
              )}
              style={{
                transform: "rotate(-45deg)",
              }}
            />
          )}
        </div>
      </div>
    </NextLink>
  );
}
