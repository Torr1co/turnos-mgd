import React, { type FormHTMLAttributes } from "react";
import { FieldInput } from "../Input";
import FormField, { type FieldPropsInitial } from "./Field";
import {
  FormProvider,
  type UseFormReturn,
  type FieldValues,
} from "react-hook-form";
import { hasKey } from "~/utils/obj";

interface FormProps<T extends FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  methods: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FieldConvertion<T extends (...args: any) => any> = (
  props: Parameters<T>[0] & FieldPropsInitial
) => JSX.Element;

function Form<T extends FieldValues>({
  methods,
  children,
  onSubmit,
  ...props
}: FormProps<T>) {
  const handleSubmit = methods.handleSubmit(onSubmit) as () => void;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} {...props}>
        {children}
      </form>
    </FormProvider>
  );
}

Form.Input = FieldInput as FieldConvertion<typeof FieldInput>;

const ProxyForm = new Proxy(Form, {
  get: function (target, key) {
    if (hasKey(target, key)) {
      const KeyComponent = target[key];

      return function Field(props: Parameters<typeof KeyComponent>[0]) {
        return <FormField Component={KeyComponent} {...props} />;
      };
    }
    return null;
  },
});

export default ProxyForm;
