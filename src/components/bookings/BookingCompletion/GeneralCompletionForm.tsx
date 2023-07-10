import React from "react";
import Form from "~/components/_common/Form";
import { useFormContext } from "react-hook-form";
import { type BookingCompletionSchema } from "~/schemas";

export default function GeneralCompletionForm() {
  const methods = useFormContext<BookingCompletionSchema>();
  return (
    <div className="grid gap-6">
      <Form.TextArea path="general.observations" label="Observaciones" />
      <Form.Number
        path="general.height"
        label="Altura (cm)"
        min={0}
        onChange={(e) => {
          methods.setValue(
            "general.height",
            +parseFloat(e.target.value.replace(/[^\d.\s]/g, "")).toFixed(2)
          );
        }}
        required
      />
    </div>
  );
}
