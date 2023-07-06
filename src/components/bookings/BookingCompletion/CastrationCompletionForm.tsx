import React from "react";
import Form from "~/components/_common/Form";

export default function CastrationCompletionForm() {
  return (
    <div className="grid gap-6">
      <Form.Input path="castration.type" label="Tipo de castracion" required />
    </div>
  );
}
