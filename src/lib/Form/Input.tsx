import React, { forwardRef, type InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import { type Field } from "./Field";
import { cn } from "~/utils/styles";

const KINDS = {
  primary:
    "border-gray-400 placeholder-gray-500 focus:border-primary-400 ring-primary-500",
  error: "border-red-400 placeholder-gray-500 ring-red-300",
} as const;

type Ref = HTMLInputElement;
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  kind?: keyof typeof KINDS;
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
        KINDS[kind],
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

export function FieldDate({ type, options, ...props }: Field<InputProps>) {
  return (
    <FieldInput
      type="date"
      {...props}
      options={{ ...{ options }, valueAsDate: true }}
    />
  );
}

export default Input;
