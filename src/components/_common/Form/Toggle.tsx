import React from "react";
import { Controller } from "react-hook-form";
import { type Field } from "./Field";
import { Switch, type SwitchProps } from "@headlessui/react";

type ToggleProps = SwitchProps<"button"> & {
  label?: string;
  path?: string;
  checked: boolean;
};

export default function Toggle({
  label,
  path,
  checked,
  ...props
}: ToggleProps) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-base font-medium text-gray-600" htmlFor={path}>
        {label}
      </label>
      <Switch
        {...props}
        className={`${
          checked ? "bg-primary" : "bg-gray-200"
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span
          className={`${
            checked ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
    </div>
  );
}

export function FieldToggle({
  path,
  label,
  ...props
}: Field<Omit<ToggleProps, "checked">>) {
  return (
    <Controller
      name={path}
      render={({ field }) => (
        <Toggle
          {...props}
          {...field}
          label={label}
          checked={!!field.value}
          onChange={(value: boolean) => {
            field.onChange(value);
            props.onChange?.(value);
          }}
        />
      )}
    />
  );
}
