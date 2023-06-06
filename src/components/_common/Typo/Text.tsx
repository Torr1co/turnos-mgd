import React from "react";
import { cn } from "~/utils/styleUtils";
import { type FC } from "~/utils/language/types";

export default function Text({ className, children }: FC) {
  return <p className={cn("font-regular text-base", className)}>{children}</p>;
}
