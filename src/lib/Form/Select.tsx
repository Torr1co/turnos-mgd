import { Listbox } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Controller } from "react-hook-form";
import { type FC } from "~/utils/types";

type SelectOption = {
  value: string | number;
  label: string;
};

interface SelectProps extends FC {
  values: SelectOption[];
  value: SelectOption["value"];
  onChange: (value: SelectOption["value"]) => void;
}
export default function Select({
  values,
  children,
  value,
  onChange,
}: SelectProps) {
  return (
    <Listbox value={value} onChange={onChange}>
      <Listbox.Button className="font-regular rounded-md border border-gray-400 py-3.5 px-5 outline-none focus:ring-1">
        {({ open }) => {
          return (
            <div className="flex items-center justify-between">
              <div>
                {(value &&
                  values.find((option) => option.value === value)?.label) ??
                  children}
              </div>
              {open ? (
                <ChevronUpIcon
                  className="h-5 w-5 text-gray-600"
                  aria-hidden="true"
                />
              ) : (
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-600"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        }}
      </Listbox.Button>
      <div className="relative">
        <Listbox.Options className="absolute w-max min-w-[16rem] divide-y divide-gray-100 rounded-md border bg-white py-2 text-gray-600 shadow-xl">
          {values.map((option, i) => (
            <Listbox.Option
              key={i}
              value={option.value}
              className="cursor-pointer py-2 px-5 hover:bg-gray-100"
            >
              {option.label}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}

interface FieldSelectProps extends Omit<SelectProps, "value" | "onChange"> {
  path: string;
}

export function FieldSelect({ path, ...props }: FieldSelectProps) {
  return (
    <Controller
      name={path}
      render={({ field }) => <Select {...props} {...field} />}
    />
  );
}
