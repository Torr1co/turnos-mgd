/* model DonationCampaign {
    id            String     @id @default(auto()) @map("_id") @db.ObjectId
    createdAt     DateTime   @default(now())
    updatedAt     DateTime   @updatedAt
    reason        String
    desc          String
    amountGoal    Int
    currentAmount Int        @default(0)
    img           String?
    donations     Donation[]
} */
import { z } from "zod";

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
  });

export const DonateSchema = z.object({
  donationCampaignId: z.string(),
  amount: z.number(),
});

export type DonateSchema = z.infer<typeof DonateSchema>;

export type DonationCampaignCreationSchema = z.infer<
  typeof DonationCampaignCreationSchema
>;
export type DonationCampaignUpdateSchema = z.infer<
  typeof DonationCampaignUpdateSchema
>;
