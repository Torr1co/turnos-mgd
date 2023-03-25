import React, { forwardRef, type InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import { type FieldPropsOmitted } from "./Form/Field";
import { cn } from "~/utils/styles";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

type Ref = HTMLInputElement;

const Input = forwardRef<Ref, InputProps>(function ForwardInput(
  { className, ...props },
  ref
) {
  return (
    <input
      {...props}
      className={cn(
        "rounded-md border border-gray-500 py-2 px-4 placeholder-gray-500 hover:border-orange-400",
        className
      )}
      ref={ref}
      name="test"
    />
  );
});

export function Field(props: InputProps & FieldPropsOmitted) {
  const { register } = useFormContext();
  return <Input {...register(props.path)} {...props} />;
}

export default Input;
