import React, { type FormHTMLAttributes } from "react";
import { Field } from "../Input";
import FormField, { type FieldPropsInitial } from "./Field";
import {
  FormProvider,
  type UseFormReturn,
  type FieldValues,
} from "react-hook-form";

interface FormProps<T extends FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  methods: UseFormReturn<T>;
  onSubmit: (data: T) => void;
}

function Form<T extends FieldValues>({
  methods,
  children,
  onSubmit,
  ...props
}: FormProps<T>) {
  return (
    <FormProvider {...methods}>
      <form onSubmit={() => methods.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </FormProvider>
  );
}

// Form.Input = FormInput;
Form.Input = Field;

const keys = Object.keys(Form) as Array<keyof typeof Form>;

keys.forEach((key: keyof typeof Form) => {
  const KeyComponent = Form[key];
  Form[key] = (
    props: Parameters<typeof KeyComponent>[0] & FieldPropsInitial
  ) => <FormField Component={KeyComponent} {...props} />;
});

export default Form;
