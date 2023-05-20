import { DatePicker, type DatePickerProps } from "antd";
import React from "react";
import { type Field } from "./Field";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";

const CustomDatePicker = (props: DatePickerProps) => {
  return (
    <DatePicker
      placeholder="seleccionar fecha"
      className="font-regular rounded-md border py-3.5 px-5 font-custom text-gray-600 outline-none placeholder:text-gray-600 hover:border-primary focus:border-primary focus:ring-1"
      {...props}
    />
  );
};

export const FieldDatePicker = ({
  path,
  options,
  error,
  ...props
}: Field<DatePickerProps>) => {
  return (
    <Controller
      name={path}
      rules={options}
      render={({ field }) => {
        return (
          <CustomDatePicker
            id={path}
            name={path}
            value={field.value ? dayjs(field.value as Date) : null}
            onChange={(e) => {
              field.onChange(e?.toDate());
            }}
            {...props}
          />
        );
      }}
    />
  );
};
export default CustomDatePicker;
