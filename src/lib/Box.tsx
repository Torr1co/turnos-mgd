import React, { HTMLAttributes } from "react";
import { hasKey } from "~/utils/objUtils";
import { cn } from "~/utils/styles";
import { type FC } from "~/utils/types";

const KINDS = {
  gray: "border border-gray-400",
  primary: "border border-gray-400",
  basic: "",
} as const;

const SIZES = {
  lgY: "px-10 py-14 rounded-lg",
  lgX: "px-14 py-10 rounded-lg",
};

type BoxProps = HTMLAttributes<HTMLDivElement> & {
  kind?: string;
  size?: keyof typeof SIZES | string;
};

const Box = ({
  className,
  children,
  kind = KINDS.gray,
  size = "lgY",
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
