import React from "react";
import Form from "~/components/_common/Form";

export default function CastrationCompletionForm() {
  return (
    <div className="grid gap-6">
      <Form.Toggle
        path="castration.succesful"
        label="Confirmar Castracion"
        required
      />
    </div>
  );
}
