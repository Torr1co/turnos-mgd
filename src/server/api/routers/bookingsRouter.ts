import dayjs from "dayjs";
import mercadopago from "mercadopago";
import { z } from "zod";
import { BookingCreationSchema, StartBookingSchema } from "~/schemas";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { mp } from "~/server/payments/mercadoPago";
import { getBaseUrl } from "~/utils/api";
import { getBookingQueryParams } from "~/utils/bookingUtils";

export const bookingsRouter = createTRPCRouter({
  startBooking: publicProcedure
    .input(StartBookingSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session?.user;

      const service = await ctx.prisma.service
        .findFirstOrThrow({
          where: {
            id: input.serviceId,
          },
        })
        .catch(() => {
          throw new Error("Servicio no encontrado");
        });

      const successUrl = `${getBaseUrl()}/bookings/payment/success`;
      const failureUrl = `${getBaseUrl()}/bookings/payment/failure`;
      const notificationUrl = `${
        process.env.NODE_ENV === "development"
          ? "https://c9a45d59d5aa-7158303734866948717.ngrok-free.app"
          : getBaseUrl()
      }/api/mercadopago/createBooking?${getBookingQueryParams({
        ...input,
        amount: input.payment.amount,
        date: input.date.toString(),
        userId: user?.id ?? "",
      })}`;

      const preference = {
        items: [
          {
            title: `Reserva del servicio: ${service.title}`,
            unit_price: input.payment.amount,
            currency_id: "ARS",
            quantity: 1,
          },
        ],
        back_urls: {
          success: successUrl,
          failure: failureUrl,
        },
        notification_url: notificationUrl,
        statement_descriptor: "Magdalena Digital",
        auto_return: "approved",
      } satisfies Parameters<typeof mercadopago.preferences.create>[0];

      return await mp()
        .preferences.create(preference)
        .then((response) => {
          return (response.body as { id: string }).id;
        })
        .catch(() => {
          throw new Error("Error al crear la pasarela de pago");
        });
    }),

  create: publicProcedure
    .input(BookingCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session?.user;
      if (!input.payment && !user) {
        throw new Error("No puedes solicitar un turno gratuito sin una cuenta");
      }

      if (
        user &&
        (await ctx.prisma.booking.findFirst({
          where: {
            userId: user.id,
            date: {
              gte: dayjs().startOf("day").toDate(),
            },
          },
        }))
      ) {
        throw new Error(
          "No puedes solicitar mas de un turno gratuito a la vez"
        );
      }

      const service = await ctx.prisma.service
        .findFirstOrThrow({
          where: {
            id: input.serviceId,
          },
        })
        .catch(() => {
          throw new Error("Servicio no encontrado");
        });

      const booking = await ctx.prisma.booking.create({
        data: {
          date: dayjs(input.date).toDate(),
          schedule: input.schedule,
          username: input.username,
          totalAmount: service.price,
          service: {
            connect: {
              id: input.serviceId,
            },
          },

          ...(input.payment
            ? {
                payment: {
                  create: {
                    amount: input.payment.amount,
                    paymentId: input.payment.id,
                  },
                },
              }
            : {}),
          ...(input.userId
            ? {
                user: {
                  connect: {
                    id: input.userId,
                  },
                },
              }
            : {}),
        },
      });

      const ownerId = await ctx.prisma.service
        .findUnique({
          where: {
            id: input.serviceId,
          },
        })
        .business()
        .then((business) => business?.ownerId);

      if (ownerId) {
        const currentSubscription = await ctx.prisma.subscription.findFirst({
          orderBy: {
            createdAt: "desc",
          },
          where: {
            userId: ownerId,
          },
        });

        if (currentSubscription && input.payment) {
          await ctx.prisma.subscription.update({
            where: {
              id: currentSubscription.id,
            },
            data: {
              amount: currentSubscription.amount + input.payment.amount / 10,
            },
          });
        }
      }
      return booking;
    }),

  getBy: publicProcedure
    .input(
      z.object({
        id: z.optional(z.string()),
        paymentId: z.optional(z.string()),
      })
    )
    .query(async ({ input, ctx }) => {
      const baseinput = {
        include: {
          service: {
            include: {
              business: true,
            },
          },
          payment: true,
        },
      };

      if (input.id) {
        return ctx.prisma.booking.findFirstOrThrow({
          where: {
            id: input.id,
          },
          ...baseinput,
        });
      } else if (input.paymentId) {
        return await ctx.prisma.booking.findFirstOrThrow({
          where: {
            payment: {
              paymentId: input.paymentId,
            },
          },
          ...baseinput,
        });
      }

      throw new Error("No se encontró el turno");
    }),

  getAll: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.booking.findMany({
      include: {
        service: {
          include: {
            business: true,
          },
        },
        payment: true,
        user: true,
      },
    });
  }),

  getMine: publicProcedure
    .input(z.optional(z.array(z.string())))
    .query(async ({ ctx, input: bookingIds }) => {
      const user = ctx.session?.user;
      if (!user && !bookingIds) return [];
      if (!user)
        return await ctx.prisma.booking.findMany({
          where: {
            id: {
              in: bookingIds,
            },
          },
          include: {
            service: {
              include: {
                business: true,
              },
            },
            payment: true,
            user: true,
          },
        });
      return await ctx.prisma.booking.findMany({
        where: {
          userId: user.id,
        },
        include: {
          service: {
            include: {
              business: true,
            },
          },
          payment: true,
          user: true,
        },
      });
    }),

  getBusinesses: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    return await ctx.prisma.booking.findMany({
      where: {
        service: {
          business: {
            ownerId: user.id,
          },
        },
      },
      include: {
        service: {
          include: {
            business: true,
          },
        },
        payment: true,
        user: true,
      },
    });
  }),
});
