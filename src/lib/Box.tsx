import React from "react";
import { hasKey } from "~/utils/objUtils";
import { cn } from "~/utils/styles";
import { type FC } from "~/utils/types";

const KINDS = {
  gray: "border-2 border-gray-400",
  primary: "border-2 border-gray-400",
  basic: "",
} as const;

const SIZES = {
  lg: "px-14 py-10 rounded-lg",
};

type BoxProps = {
  kind?: string;
  size?: keyof typeof SIZES | string;
};

const Box = ({
  className,
  children,
  kind = KINDS.gray,
  size = "lg",
}: FC<BoxProps>) => {
  return (
    <div
      className={cn(className, kind, hasKey(SIZES, size) ? SIZES[size] : size)}
    >
      {children}
    </div>
  );
};

Box.KINDS = KINDS;

export default Box;
