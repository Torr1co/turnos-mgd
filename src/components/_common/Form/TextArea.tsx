import { type TextareaHTMLAttributes, forwardRef } from "react";
import { type Field } from "./Field";
import React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "~/utils/styleUtils";
const KINDS = {
  primary:
    "border-gray-400 placeholder-gray-500 focus:border-primary-400 ring-primary-500",
  error: "border-red-400 placeholder-gray-500 ring-red-300",
} as const;

type Ref = HTMLTextAreaElement;
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  kind?: keyof typeof KINDS;
}
const TextArea = forwardRef<Ref, TextAreaProps>(function ForwardTextArea(
  { className, kind = "primary", ...props },
  ref
) {
  return (
    <textarea
      {...props}
      ref={ref}
      className={cn(
        KINDS[kind],
        className,
        "font-regular max-h-[140px] min-h-[80px] rounded-md border py-3.5 px-5 text-sm outline-none focus:ring-1"
      )}
    />
  );
});

export function FieldTextArea({
  path,
  options,
  error,
  ...props
}: Field<TextAreaProps>) {
  const { register } = useFormContext();
  return (
    <TextArea
      {...register(path, {
        ...options,
      })}
      id={path}
      name={path}
      autoComplete="off"
      {...props}
      kind={error ? "error" : undefined}
    />
  );
}
