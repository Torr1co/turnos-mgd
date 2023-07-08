
import React from "react";
import Form from "~/components/_common/Form";
import { useFormContext } from "react-hook-form";
import { type BookingCompletionSchema } from "~/schemas";

export default function VaccineCompletionForm() {
   const methods = useFormContext< BookingCompletionSchema >();
    return (
      
      <div className="grid gap-6">
        <Form.Number
          path="vaccine.dosis"
          label="Dosis de vacuna (ml)"
          min={0}
          onChange={(e) => {
            methods.setValue(
              "vaccine.dosis",
              +parseFloat(e.target.value.replace(/[^\d.\s]/g, "")).toFixed(2)
            );
          }}
          required
        />
      </div>
    );
  }