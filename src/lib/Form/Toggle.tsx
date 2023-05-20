import React from "react";
import { Controller } from "react-hook-form";
import { type Field } from "./Field";
import { Switch, type SwitchProps } from "@headlessui/react";

export default function FieldToggle({
  path,
  label,
  ...props
}: Field<SwitchProps<"button"> & { label?: string }>) {
  return (
    <Controller
      name={path}
      render={({ field }) => (
        <div className="flex items-center gap-4">
          <label className="text-base font-medium text-gray-600" htmlFor={path}>
            {label}
          </label>
          <Switch
            {...props}
            {...field}
            className={`${
              field.value ? "bg-primary" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                field.value ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>
      )}
    />
  );
}
