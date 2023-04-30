import React, { ButtonHTMLAttributes } from "react";
import { hasKey } from "~/utils/obj";
import { cn } from "~/utils/styles";

const SIZES = {
  sm: "px-4 py-2",
  md: "px-6 py-3",
} as const;

const KINDS = {
  primary: "bg-primary-400 text-white font-semibold",
  secondary: "bg-secondary-400 text-white font-semibold",
  gray: "bg-gray-300 text-gray-600 font-regular",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: keyof typeof SIZES | string;
  kind?: keyof typeof KINDS | string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const Button = ({ size = "md", kind = "primary", ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        "rounded-md",
        hasKey(SIZES, size) ? SIZES[size] : size,
        hasKey(KINDS, kind) ? KINDS[kind] : kind
      )}
      {...props}
    />
  );
};

export default Object.assign(Button, { SIZES, KINDS });
