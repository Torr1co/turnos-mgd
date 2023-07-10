import React from "react";
import Form from "~/components/_common/Form";
import { useFormContext } from "react-hook-form";
import { type BookingCompletionSchema } from "~/schemas";

export default function DewormingCompletionForm() {
  const methods = useFormContext<BookingCompletionSchema>();
  return (
    <div className="grid gap-6">
      <Form.Input
        path="deworming.product"
        label="Producto antiparasitario"
        required
      />
      <Form.Number
        path="deworming.dosis"
        label="Dosis de antiparasitario (ml)"
        min={0}
        onChange={(e) => {
          methods.setValue(
            "deworming.dosis",
            +parseFloat(e.target.value.replace(/[^\d.\s]/g, "")).toFixed(2)
          );
        }}
        required
      />
    </div>
  );
}
