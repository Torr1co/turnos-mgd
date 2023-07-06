import React from "react";
import { api } from "~/utils/api";
import Title from "~/components/_common/Typo/Title";
import Button from "~/components/_common/Button";
import Form from "~/components/_common/Form";
import { DonateSchema } from "~/schemas/donationSchema";
import { useForm } from "~/utils/schemaUtils";
import { type DonationCampaign } from "@prisma/client";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { toast } from "react-hot-toast";

export default function DonateModal({
  donationCampaign,
}: {
  donationCampaign: DonationCampaign;
}) {
  const { mutate: startDonation, isLoading } =
    api.donationCampaigns.startDonation.useMutation();
  const methods = useForm<DonateSchema & { preferenceId?: string }>({
    schema: DonateSchema,
    defaultValues: {
      amount: 0,
    },
  });
  const preferenceId = methods.watch("preferenceId");
  initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ?? "");
  return (
    <Form methods={methods} className="flex flex-col gap-6">
      <header className="sticky top-10 z-30 -mx-4 flex items-center justify-between bg-white p-4 pb-4">
        <Title as="h4" className="text-gray-500">
          Donacion en{" "}
          <span className="text-primary">{donationCampaign.title}</span>
        </Title>
      </header>
      <Form.Number
        path="amount"
        step={0.1}
        label="Dinero a donar (pesos argentinos)"
      />
      <Button
        onClick={() => {
          startDonation(
            {
              amount: methods.watch("amount"),
              donationCampaignId: donationCampaign.id,
            },
            {
              onSuccess: (preferenceId) => {
                methods.setValue("preferenceId", preferenceId);
                toast.success("Se ha creado la pasarela de pago");
              },
              onError: (err) => {
                toast.error(err.message);
              },
            }
          );
        }}
        loading={isLoading}
      >
        Confirmar donacion
      </Button>
      {preferenceId && (
        <Wallet initialization={{ preferenceId }} locale="es-AR" />
      )}
    </Form>
  );
}
