import React from "react";
import Tippy, { type TippyProps } from "@tippyjs/react";
import { cn } from "~/utils/styleUtils";

export default function Tooltip({ className, ...props }: TippyProps) {
  return (
    <Tippy
      className={cn(
        "rounded-md bg-white py-2 px-4 shadow-lg transition-all duration-300",
        className
      )}
      delay={[100, 300]}
      arrow
      {...props}
    />
  );
}
