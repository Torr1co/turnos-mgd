import React from "react";
import Form from "~/components/_common/Form";
import { useFormContext } from "react-hook-form";
import { type GeneralInquirieSchema } from "~/schemas/inquirieSchema";

export default function CastrationCompletionForm() {
  const methods = useFormContext<{ general: GeneralInquirieSchema }>();
  return (
    <div className="grid gap-6 md:grid-cols-2">
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
      <Form.Number
        path="general.weight"
        label="Peso (kg)"
        min={0}
        onChange={(e) => {
          methods.setValue(
            "general.weight",
            +parseFloat(e.target.value.replace(/[^\d.\s]/g, "")).toFixed(2)
          );
        }}
        required
      />
      <div className="md:col-span-2">
        <Form.TextArea path="general.observations" label="Observaciones" />
      </div>
    </div>
  );
}
