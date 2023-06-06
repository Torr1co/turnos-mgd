import React, { forwardRef, useState, type InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import { type Field } from "./Field";
import { cn } from "~/utils/styleUtils";
import { hasKey } from "~/utils/language/objUtils";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const KINDS = {
  primary:
    "border-gray-400 placeholder-gray-500 focus:border-primary-400 ring-primary-500",
  error: "border-red-400 placeholder-gray-500 ring-red-300",
} as const;

type Ref = HTMLInputElement;
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  kind?: keyof typeof KINDS | string;
}
const Input = forwardRef<Ref, InputProps>(function ForwardInput(
  { className, kind = "primary", ...props },
  ref
) {
  return (
    <input
      {...props}
      ref={ref}
      className={cn(
        hasKey(KINDS, kind) ? KINDS[kind] : kind,
        className,
        "font-regular rounded-md border py-3.5 px-5 text-sm outline-none focus:ring-1"
      )}
    />
  );
});

export function FieldInput({
  path,
  options,
  error,
  onChange,
  ...props
}: Field<InputProps>) {
  const { register } = useFormContext();
  return (
    <Input
      {...register(path, {
        ...options,
        onChange,
      })}
      id={path}
      name={path}
      autoComplete="off"
      {...props}
      kind={error ? "error" : undefined}
    />
  );
}

export function FieldNumber({ options, ...props }: Field<InputProps>) {
  return (
    <FieldInput
      type="number"
      {...props}
      options={{ ...{ options }, valueAsNumber: true }}
    />
  );
}

export function FieldPassword({
  type,
  className,
  ...props
}: Field<InputProps>) {
  const [show, setShow] = useState(false);
  return (
    <div className={cn("relative w-full", className)}>
      <FieldInput
        type={show ? "text" : "password"}
        className="h-full w-full pr-12"
        {...props}
      />
      <button
        type="button"
        className={cn(
          "absolute right-5 top-1/2 -translate-y-1/2 transform ",
          show ? "text-gray-500" : "text-gray-400"
        )}
        onClick={() => setShow((show) => !show)}
      >
        {show ? (
          <EyeIcon className="h-6 w-6" />
        ) : (
          <EyeSlashIcon className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}

export default Input;
