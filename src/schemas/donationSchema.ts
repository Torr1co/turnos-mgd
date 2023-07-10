import { z } from "zod";
import {
  type User,
  type Donation,
  DonationCampaignStatus,
} from "@prisma/client";

export type DonationRelated = Donation & {
  user?: User | null;
};
export const DonationCampaignCreationSchema = z.object({
  reason: z.string().trim().min(10, "Minimo 10 caracteres"),
  title: z.string().trim().min(1, "Requerido"),
  amountGoal: z
    .number({
      invalid_type_error: "Requerido",
    })
    .min(1, "Requerido"),
  endDate: z.date({
    required_error: "Requerido",
    invalid_type_error: "Requerido",
  }),
  img: z.optional(z.string()),
});

export const DonationCampaignUpdateSchema =
  DonationCampaignCreationSchema.extend({
    id: z.string(),
    amountGoal: z.number({
      invalid_type_error: "Requerido",
    }),
    currentAmount: z.number(),
  }).refine((data) => data.amountGoal >= data.currentAmount, {
    message: "No se puede reducir el monto actual",
    path: ["amountGoal"],
  });

export const DonateSchema = z.object({
  donationCampaignId: z.string(),
  amount: z
    .number({
      invalid_type_error: "Requerido",
    })
    .min(1, "Requerido"),
});

export const DonationCampaignGetAllSchema = z
  .optional(
    z.object({
      status: z.nativeEnum(DonationCampaignStatus),
    })
  )
  .default({ status: DonationCampaignStatus.ACTIVE });

export type DonateSchema = z.infer<typeof DonateSchema>;
export type DonationCampaignGetAllSchema = z.infer<
  typeof DonationCampaignGetAllSchema
>;

export type DonationCampaignCreationSchema = z.infer<
  typeof DonationCampaignCreationSchema
>;
export type DonationCampaignUpdateSchema = z.infer<
  typeof DonationCampaignUpdateSchema
>;
