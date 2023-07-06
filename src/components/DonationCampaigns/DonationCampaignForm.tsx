import dayjs from "dayjs";
import React from "react";
import Form from "~/components/_common/Form";

export default function DonationCampaignForm() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Form.Input path="title" label="Titulo" />

      <Form.Number
        path="amountGoal"
        step={0.1}
        label="Dinero objetivo (pesos argentinos)"
      />
      <Form.Date
        path="endDate"
        label="Fecha de finalizacion"
        disabledDate={(current) => {
          return current.isBefore(dayjs(), "d");
        }}
      />
      <Form.ImageUploader path="img" label="Imagen" />
      <div className="col-span-2 flex flex-col gap-6">
        <Form.TextArea path="reason" label="Razon de la campaña" required />
      </div>
    </div>
  );
}
