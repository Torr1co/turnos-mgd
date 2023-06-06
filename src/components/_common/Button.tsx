import React, { forwardRef, type ButtonHTMLAttributes } from "react";
import { hasKey } from "~/utils/language/objUtils";
import { cn } from "~/utils/styleUtils";
import { type FC } from "~/utils/language/types";
import Loading from "./Loading";

const SIZES = {
  sm: "px-4 py-2 ",
  md: "px-4 py-1.5 md:px-6 md:py-3 text-sm md:text-base",
} as const;

const KINDS = {
  primary:
    "bg-primary-400 text-white font-semibold disabled:brightness-90 disabled:text-opacity-50",
  secondary:
    "bg-secondary-400 text-white font-semibold disabled:brightness-90 disabled:text-opacity-50",
  danger: "bg-red-400 text-white font-semibold",
  gray: "bg-gray-300 text-gray-600 font-regular",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: keyof typeof SIZES | string;
  kind?: keyof typeof KINDS | string;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, FC<ButtonProps>>(
  function ForwardButton(
    {
      size = "md",
      kind = "primary",
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={cn(
          className,
          "relative rounded-sm md:rounded-md ",
          hasKey(SIZES, size) ? SIZES[size] : size,
          hasKey(KINDS, kind) ? KINDS[kind] : kind
        )}
        disabled={disabled ?? loading}
        type="button"
        {...props}
      >
        {loading && (
          <Loading
            className="absolute inset-0"
            kind={"bg-white"}
            size={hasKey(SIZES, size) ? size : "md"}
          />
        )}
        {children}
      </button>
    );
  }
);

export default Object.assign(Button, { SIZES, KINDS });
