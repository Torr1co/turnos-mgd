import type { FieldValues, UseFormProps, UseFormReturn } from "react-hook-form";
import { useForm as rhUseForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType, z } from "zod";
import { type SelectOption } from "~/components/_common/Form/Select";

export const useForm = <
  TFieldValues extends FieldValues = z.infer<typeof schema>,
  TContext = any,
  T extends ZodType = ZodType<any>
>(
  props: UseFormProps<TFieldValues, TContext> & { schema: T }
): UseFormReturn<TFieldValues, TContext> => {
  const { schema, ...rest } = props;

  return rhUseForm<TFieldValues, TContext>({
    resolver: zodResolver(schema),
    ...rest,
  });
};

export function getOptionLabel<T extends string | number | undefined | null>(
  options: SelectOption<T>[] | readonly SelectOption<T>[],
  value: T
) {
  return options.find((option) => option.value === value)?.label as string;
}
