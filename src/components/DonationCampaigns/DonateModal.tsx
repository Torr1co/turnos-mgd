import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Title from "~/components/_common/Typo/Title";
import Button from "~/components/_common/Button";
import Form from "~/components/_common/Form";
import { DonateSchema } from "~/schemas/donationSchema";
import { useForm } from "~/utils/schemaUtils";
import { DonationCampaignStatus, type DonationCampaign } from "@prisma/client";
// import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { toast } from "react-hot-toast";
import { hasFormErrors } from "~/utils/errors";
import { useRouter } from "next/router";

export default function DonateModal({
  donationCampaign,
}: {
  donationCampaign: DonationCampaign;
}) {
  const router = useRouter();
  useEffect(() => {
    const paymentStatus = router.query.status;
    if (paymentStatus === "approved") {
      toast.success("Se realizo el pago con exito");
    }
  }, [router.query.status]);
  const [Component, setComponent] = useState<JSX.Element | null>(null);
  const { mutate: startDonation, isLoading } =
    api.donationCampaigns.startDonation.useMutation({
      onSuccess: async (preferenceId) => {
        const { initMercadoPago, Wallet } = await import(
          "@mercadopago/sdk-react"
        );
        initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ?? "");
        setComponent(
          <Wallet initialization={{ preferenceId }} locale="es-AR" />
        );
      },
    });
  const methods = useForm<DonateSchema>({
    schema: DonateSchema,
    defaultValues: {
      amount: 0,
      donationCampaignId: donationCampaign.id,
    },
  });

  return (
    <Form methods={methods} className="flex  flex-col justify-between">
      <header className="z-30 flex items-center justify-between bg-white pb-4">
        <Title as="h4" className="text-gray-500">
          Donacion en{" "}
          <span className="text-primary">{donationCampaign.title}</span>
        </Title>
      </header>
      {donationCampaign.status === DonationCampaignStatus.ACTIVE ? (
        <div className="flex flex-col gap-6">
          <Form.Number
            path="amount"
            step={0.1}
            label="Dinero a donar (pesos argentinos)"
          />
          <div className="flex gap-4">
            <div>
              <Button
                type="button"
                loading={isLoading}
                disabled={hasFormErrors(methods.formState)}
                onClick={() => {
                  const handleSubmit = methods.handleSubmit(() => {
                    console.log("here2");
                    startDonation(
                      {
                        ...methods.getValues(),
                      },
                      {
                        onSuccess: () => {
                          toast.success("Se ha creado la pasarela de pago");
                        },
                        onError: (err) => {
                          toast.error(err.message);
                        },
                      }
                    );
                  });
                  void handleSubmit();
                  console.log("here");
                }}
              >
                Confirmar donacion
              </Button>
            </div>
            <div className="-my-4 w-min">{Component}</div>
          </div>
        </div>
      ) : (
        "Esta campaña ha finalizado"
      )}
    </Form>
  );
}
