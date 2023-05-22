import React, { type FormHTMLAttributes } from "react";
import { FieldInput, FieldNumber } from "./Input";
import { FieldTextArea } from "./TextArea";
import Field, { type FieldPropsInitial } from "./Field";
import {
  FormProvider,
  type UseFormReturn,
  type FieldValues,
} from "react-hook-form";
import { FieldSelect } from "./Select";
import FieldToggle from "./Toggle";
import { FieldDatePicker } from "./DatePicker";
import { FieldImage } from "./ImageUpload";

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
Form.Number = FieldNumber as FieldConvertion<typeof FieldInput>;
Form.Date = FieldDatePicker as FieldConvertion<typeof FieldDatePicker>;
Form.Select = FieldSelect as FieldConvertion<typeof FieldSelect>;
Form.TextArea = FieldTextArea as FieldConvertion<typeof FieldTextArea>;
Form.ImageUploader = FieldImage as FieldConvertion<typeof FieldImage>;

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

Form.Toggle = FieldToggle;

export default Form;
