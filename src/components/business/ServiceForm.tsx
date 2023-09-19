import React from "react";
import Form from "~/components/_common/Form";

export default function ServiceForm({
  path,
  index,
}: {
  path: string;
  index: number;
}) {
  const componentPath = `${path}.${index}`;
  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        <Form.Input
          path={componentPath + ".title"}
          label="Nombre Del servicio"
          placeholder="Visita sin cargo"
          required
        />
        <Form.Number path={componentPath + ".price"} label="Precio" required />
      </div>
    </div>
  );
}
