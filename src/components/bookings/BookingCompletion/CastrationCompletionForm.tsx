import React from "react";
import Form from "~/components/_common/Form";
import { useFormContext } from "react-hook-form";
import { type BookingCompletionSchema } from "~/schemas";

export default function CastrationCompletionForm() {
  const methods = useFormContext< BookingCompletionSchema >();
  return (
    <div className="grid gap-6">
      <Form.Toggle path="castration.succesful" label="Confirmar Castracion" required />
    </div>
  );
}
