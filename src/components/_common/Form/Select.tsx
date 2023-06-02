import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Controller } from "react-hook-form";
import { cn } from "~/utils/styleUtils";
import { type FC } from "~/utils/language/types";

export type SelectOption<T> = {
  value: T;
  label: string;
};

export interface SelectProps<T> extends FC {
  values: SelectOption<T>[] | readonly SelectOption<T>[];
  value: SelectOption<T>["value"];
  onChange: (value: SelectOption<T>["value"]) => void;
  kind?: string;
}
export default function Select<T extends string | number | undefined | null>({
  values,
  children,
  value,
  onChange,
  kind,
}: SelectProps<T>) {
  return (
    <Listbox as={"div"} value={value} onChange={onChange}>
      <Listbox.Button
        className={cn(
          "font-regular w-full rounded-md border border-gray-400 py-3.5  px-5 text-sm outline-none transition-colors duration-300 hover:border-primary focus:ring-1",
          kind
        )}
      >
        {({ open }) => {
          return (
            <div className="flex items-center justify-between">
              <div>
                {(value !== undefined &&
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
        <Transition
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
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
        </Transition>
      </div>
    </Listbox>
  );
}

interface FieldSelectProps<T>
  extends Omit<SelectProps<T>, "value" | "onChange"> {
  onChange?: (value: SelectOption<T>["value"]) => void;
  path: string;
}

export function FieldSelect<T extends string | number | undefined | null>({
  path,
  ...props
}: FieldSelectProps<T>) {
  return (
    <Controller
      name={path}
      render={({ field: { ref, ...field } }) => (
        <Select
          {...props}
          {...field}
          onChange={(value: T) => {
            field.onChange(value);
            props.onChange?.(value);
          }}
        />
      )}
    />
  );
}
