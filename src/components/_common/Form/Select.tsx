import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Controller } from "react-hook-form";
import { cn } from "~/utils/styleUtils";
import { type FC } from "~/utils/language/types";
import Title from "../Typo/Title";

export type SelectOption<T> = {
  value: T;
  label: string;
};

export interface BaseSelectProps<T> extends FC {
  values: SelectOption<T>[] | readonly SelectOption<T>[];
  kind?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export interface MultipleSelectProps<T> extends BaseSelectProps<T> {
  value: T[];
  onChange: (value: T[]) => void;
}

export interface SingleSelectProps<T> extends BaseSelectProps<T> {
  value: T;
  onChange: (value: T) => void;
}

export type SelectProps<T> = MultipleSelectProps<T> | SingleSelectProps<T>;

const isMultiple = <T extends string | number | undefined | null>(
  props: SelectProps<T>
): props is MultipleSelectProps<T> => {
  return !!props.multiple;
};

export default function Select<T extends number | string | undefined | null>(
  props: SelectProps<T>
) {
  const { values, children, value, onChange, kind, disabled, multiple } = props;

  function Label(props: SelectProps<T>) {
    if (isMultiple(props)) {
      return (
        <div className="flex flex-wrap">
          {props.value
            .map(
              (v) => props.values.find((option) => option.value === v)?.label
            )
            .join(", ")}
        </div>
      );
    }

    return (
      <>
        {value === undefined
          ? children
          : props.values.find((option) => option.value === value)?.label}
      </>
    );
  }

  return (
    <Listbox
      as={"div"}
      value={value}
      onChange={onChange}
      multiple={multiple}
      disabled={disabled}
    >
      <Listbox.Button
        className={cn(
          "font-regular  w-full rounded-md border border-gray-400 py-3.5  px-5 text-sm outline-none transition-colors duration-300 focus:ring-1 disabled:cursor-not-allowed disabled:bg-gray-300",
          !disabled && "hover:border-primary",
          kind
        )}
      >
        {({ open }) => {
          return (
            <div className="flex items-center justify-between">
              <div>
                <Label {...props} />
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
      <div className="relative z-30">
        <Transition
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Listbox.Options className="absolute max-h-52 w-max min-w-[16rem] divide-y divide-gray-100 overflow-auto rounded-md border bg-white py-2 text-gray-600 shadow-xl">
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
  onChange?: (value: T | T[]) => void;
  path: string;
  multiple?: boolean;
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
          onChange={(value: T | T[]) => {
            field.onChange(value);
            props.onChange?.(value);
          }}
        />
      )}
    />
  );
}

export function SelectHeader<T extends string | number | undefined>({
  values,
  value,
  onChange,
  kind,
}: SingleSelectProps<T>) {
  return (
    <div className={cn("flex items-center divide-x divide-gray-500", kind)}>
      {values.map((option, i) => {
        return (
          <Title
            as="h2"
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "cursor-pointer transition-colors duration-300 hover:text-primary",
              value === option.value && "text-primary",
              i !== values.length - 1 && "pr-6",
              i !== 0 && "pl-6"
            )}
          >
            {option.label}
          </Title>
        );
      })}
    </div>
  );
}

export function FieldSelectHeader<T extends string | number | undefined>({
  path,
  ...props
}: FieldSelectProps<T>) {
  return (
    <Controller
      name={path}
      render={({ field: { ref, ...field } }) => (
        <SelectHeader
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
