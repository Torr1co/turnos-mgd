import React from "react";
import Tippy, { type TippyProps } from "@tippyjs/react";
import { cn } from "~/utils/styles";

export default function Tooltip({ className, ...props }: TippyProps) {
  return (
    <Tippy
      className={cn(
        "animate-fadein rounded-md bg-white py-2 px-4 shadow-lg",
        className
      )}
      delay={[100, 300]}
      arrow
      {...props}
    />
  );
}
