import React, { type ComponentType, type ElementType } from "react";
import { type RegisterOptions, get, useFormContext } from "react-hook-form";
import Text from "../Typo/Text";
import { cn } from "~/utils/styles";

export interface FieldProps<P = unknown> {
  label?: string;
  Component: ComponentType<P> | ElementType;
  path: string;
  options?: RegisterOptions;
}
export type FieldPropsInitial = Omit<FieldProps, "Component">;

export type FieldOmmitted = Omit<FieldProps, "Component" | "label">;
export type FieldAdded = { error?: { type: string; message: string } };
export type Field<C> = C & FieldOmmitted & FieldAdded;

export default function Field({ label, Component, ...props }: FieldProps) {
  const { formState } = useFormContext();
  const error = get(formState.errors, props.path) as
    | Record<string, string>
    | undefined;

  if (props.path === "dog.race") {
    console.log(formState.errors);
  }
  return (
    <div
      className={cn(
        error && "motion-safe:animate-shake",
        "flex flex-col gap-3"
      )}
    >
      {label && (
        <label
          className="text-md font-semibold text-gray-600"
          htmlFor={props.path}
        >
          {label}
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
