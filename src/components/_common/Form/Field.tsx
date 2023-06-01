import React, { type ComponentType, type ElementType } from "react";
import { type RegisterOptions, get, useFormContext } from "react-hook-form";
import Text from "../Typo/Text";
import { cn } from "~/utils/styleUtils";

export interface FieldProps<P = unknown> {
  label?: string;
  Component: ComponentType<P> | ElementType;
  path: string;
  options?: RegisterOptions;
  required?: boolean;
}
export type FieldPropsInitial = Omit<FieldProps, "Component">;

export type FieldOmmitted = Omit<FieldProps, "Component" | "label">;
export type FieldAdded = { error?: { type: string; message: string } };
export type Field<C> = C & FieldOmmitted & FieldAdded;

export default function Field({
  label,
  Component,
  required,
  ...props
}: FieldProps) {
  const { formState } = useFormContext();
  const error = get(formState.errors, props.path) as
    | Record<string, string>
    | undefined;

  return (
    <div
      className={cn(
        error && "motion-safe:animate-shake",
        "flex flex-col gap-3"
      )}
    >
      {label && (
        <label
          className="text-base font-medium text-gray-600"
          htmlFor={props.path}
        >
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <Component {...props} error={error} />
      {error && (
        <Text className="capitalize text-red-500">
          {error.message ?? error.type}
        </Text>
      )}
    </div>
  );
}
