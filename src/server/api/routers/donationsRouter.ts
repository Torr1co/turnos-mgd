import {
  DonateSchema,
  DonationCampaignCreationSchema,
  DonationCampaignUpdateSchema,
} from "~/schemas/donationSchema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { mp } from "~/server/payments/mercadoPago";
import { getBaseUrl } from "~/utils/api";

export const donationCampaignsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(DonationCampaignCreationSchema)
    .mutation(async ({ input: data, ctx }) => {
      const donationCampaign = await ctx.prisma.donationCampaign.create({
        data: {
          ...data,
          currentAmount: data.amountGoal,
        },
      });
      return donationCampaign;
    }),

  //Update reason and telephone number
  update: protectedProcedure
    .input(DonationCampaignUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;

      const donationCampaign = await ctx.prisma.donationCampaign.update({
        where: {
          id,
        },
        data,
      });
      return donationCampaign;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const donationCampaigns = await ctx.prisma.donationCampaign.findMany();
    return donationCampaigns;
  }),

  //Returns all the adopt publications that are finished
  getCompleted: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.donationCampaign.findMany({
      where: {
        OR: [
          {
            currentAmount: {
              lte: 0,
            },
          },
          {
            endDate: {
              lte: new Date(),
            },
          },
        ],
      },
    });
  }),

  startDonation: publicProcedure
    .input(DonateSchema)
    .mutation(async ({ input, ctx }) => {
      const { donationCampaignId: id, amount } = input;
      const donationCampaign = await ctx.prisma.donationCampaign
        .findFirstOrThrow({
          where: {
            id,
          },
        })
        .catch(() => {
          throw new Error("Campaña de donacion no encontrada");
        });
      const backUrl = `${getBaseUrl()}/dog-assistance/donation-campaigns/${id}`;
      const preference = {
        items: [
          {
            title: `Donacion para la campaña ${donationCampaign.title}`,
            unit_price: amount,
            currency_id: "ARS",
            quantity: 1,
          },
        ],
        back_urls: {
          success: backUrl,
          failure: backUrl,
        },
        statement_descriptor: "Veterinaria ¡Oh my dog!",
        auto_return: "approved",
      } satisfies Parameters<typeof mp.preferences.create>[0];

      return await mp.preferences
        .create(preference)
        .then((response) => {
          return (response.body as { id: string }).id;
        })
        .catch(() => {
          throw new Error("Error al crear la preferencia");
        });
    }),
});
