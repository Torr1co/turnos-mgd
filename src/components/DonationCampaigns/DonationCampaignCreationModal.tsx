import React from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Title from "~/components/_common/Typo/Title";
import Button from "~/components/_common/Button";
import Form from "~/components/_common/Form";
import { useModal } from "~/context/ModalContex";
import DonationCampaignForm from "./DonationCampaignForm";
import { DonationCampaignCreationSchema } from "~/schemas/donationSchema";
import { useForm } from "~/utils/schemaUtils";

export default function DonationCampaignCreationModal() {
  const { handleModal } = useModal();
  const utils = api.useContext();
  const { mutate: createPublication, isLoading } =
    api.donationCampaigns.create.useMutation({
      onSuccess: async () => {
        await utils.donationCampaigns.getAll.invalidate();
      },
    });
  const methods = useForm<DonationCampaignCreationSchema>({
    schema: DonationCampaignCreationSchema,
    defaultValues: {
      title: "",
      amountGoal: 0,
      img: "",
      reason: "",
      desc: "",
    },
  });

  return (
    <Form
      methods={methods}
      className="flex flex-col gap-6"
      onSubmit={(data) => {
        createPublication(data, {
          onSuccess: () => {
            toast.success("Publicacion creada con exito");
            handleModal();
          },
          onError: (err) => toast.error(err.message),
        });
      }}
    >
      <header className="sticky top-10 z-30 -mx-4 flex items-center justify-between bg-white p-4 pb-4">
        <Title as="h4" className="text-gray-500">
          Publicacion de{" "}
          <span className="text-primary">Campaña de Donacion</span>
        </Title>
        <div className="pl-auto">
          <Button type="submit" loading={isLoading} size="sm">
            Publicar
          </Button>
        </div>
      </header>
      <DonationCampaignForm />
    </Form>
  );
}
