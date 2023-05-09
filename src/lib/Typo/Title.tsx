import React from "react";
import { hasKey } from "~/utils/objUtils";
import { cn } from "~/utils/styles";
import { type FC, type Sizes } from "~/utils/types";

type HeadingTags = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const sizeClassNames = {
  xl: "text-2xl font-bold",
  lg: "text-xl font-bold",
  md: "text-lg font-bold",
  sm: "text-lg font-semibold",
  xs: "text-detail",
  xxs: "text-sm",
} as const;

const sizeConvertion: { [key in HeadingTags]: Sizes } = {
  h1: "xl",
  h2: "lg",
  h3: "md",
  h4: "sm",
  h5: "xs",
  h6: "xxs",
} as const;

type TitleProps = {
  as?: HeadingTags;
  size?: Sizes | string;
  className?: string;
};

export default function Title({
  className,
  children,
  as = "h2",
  size,
}: FC<TitleProps>) {
  const Tag = as;
  const sizeClassName = size
    ? hasKey(sizeClassNames, size)
      ? sizeClassNames[size]
      : size
    : sizeClassNames[sizeConvertion[as]];

  return <Tag className={cn(sizeClassName, className)}>{children}</Tag>;
}
