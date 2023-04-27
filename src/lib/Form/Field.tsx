import React, { type ComponentType, type ElementType } from "react";

export interface FieldProps<P = unknown> {
  label?: string;
  path: string;
  Component: ComponentType<P> | ElementType;
}
export type FieldPropsInitial = Omit<FieldProps, "Component">;

export type FieldPropsOmitted = Omit<FieldProps, "Component" | "label">;

export default function Field({ label, Component, ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-white" htmlFor={props.path}>
          {label}
        </label>
      )}
      <Component {...props} />
    </div>
  );
}
