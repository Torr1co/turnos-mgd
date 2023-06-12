import React, { type HTMLAttributes } from "react";
import { hasKey } from "~/utils/language/objUtils";
import { cn } from "~/utils/styleUtils";
import { type FC } from "~/utils/language/types";

const KINDS = {
  gray: "border border-gray-400",
  primary: "border border-gray-400",
  basic: "",
} as const;

const SIZES = {
  lgY: "px-6 py-8  md:px-10 md:py-14 rounded-lg",
  lgX: "py-6 px-8 md:px-14 md:py-10 rounded-lg",
  md: "py-6 md:p-10 rounded-lg",
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
