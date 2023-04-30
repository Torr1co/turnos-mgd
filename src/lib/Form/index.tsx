import React, { type FormHTMLAttributes } from "react";
import { FieldInput } from "./Input";
import Field, { type FieldPropsInitial } from "./Field";
import {
  FormProvider,
  type UseFormReturn,
  type FieldValues,
} from "react-hook-form";

interface FormProps<T extends FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  methods: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FieldConvertion<T extends (...args: any) => any> = (
  props: Parameters<T>[0] & FieldPropsInitial
) => JSX.Element;

const Form = <T extends FieldValues>({
  methods,
  children,
  onSubmit,
  ...props
}: FormProps<T>) => {
  const handleSubmit = methods.handleSubmit(onSubmit) as () => void;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} {...props}>
        {children}
      </form>
    </FormProvider>
  );
};

Form.Input = FieldInput as FieldConvertion<typeof FieldInput>;

type FormKey = keyof typeof Form;
// Form.Input = FieldInput as FieldConvertion<typeof FieldInput>;

(Object.keys(Form) as FormKey[]).forEach((key) => {
  if (typeof Form[key] === "function") {
    const KeyComponent = Form[key];

    function FormField(props: Parameters<typeof KeyComponent>[0]) {
      return <Field Component={KeyComponent} {...props} />;
    }

    Form[key] = FormField;
  }
});

export default Form;
