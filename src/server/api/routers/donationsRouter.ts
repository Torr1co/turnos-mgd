import { z } from "zod";
import {
  DonateSchema,
  DonationCampaignCreationSchema,
  DonationCampaignGetAllSchema,
  DonationCampaignUpdateSchema,
} from "~/schemas/donationSchema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  vetProcedure,
} from "~/server/api/trpc";
import { mp } from "~/server/payments/mercadoPago";
import { getBaseUrl } from "~/utils/api";
import { DonationCampaignStatus } from "@prisma/client";
import { isVet } from "~/utils/schemas/usersUtils";

export const donationCampaignsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(DonationCampaignCreationSchema)
    .mutation(async ({ input: data, ctx }) => {
      const donationCampaign = await ctx.prisma.donationCampaign.create({
        data,
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

  getAll: publicProcedure
    .input(DonationCampaignGetAllSchema)
    .query(async ({ ctx, input: { status } }) => {
      const donationCampaigns = await ctx.prisma.donationCampaign.findMany({
        where: {
          status,
        },
      });
      return donationCampaigns;
    }),

  finish: vetProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    return await ctx.prisma.donationCampaign.update({
      where: {
        id: input,
      },
      data: {
        status: DonationCampaignStatus.FINISHED,
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
      const notificationUrl = `${
        process.env.NODE_ENV === "development"
          ? "https://c9a45d59d5aa-7158303734866948717.ngrok-free.app"
          : getBaseUrl()
      }/api/donations/notification?campaignId=${id}&amount=${amount}&userId=${
        ctx.session?.user.id ?? ""
      }`;
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
        notification_url: notificationUrl,
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

  getById: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const user = ctx.session?.user;
    return await ctx.prisma.donationCampaign.findFirst({
      where: {
        id: input,
      },
      include: {
        donations: !user
          ? false
          : isVet(user)
          ? {
              include: {
                user: true,
              },
            }
          : {
              where: {
                userId: user.id,
              },
            },
      },
    });
  }),
});
