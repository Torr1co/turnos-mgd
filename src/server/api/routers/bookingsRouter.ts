import {
  clientProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  vetProcedure,
} from "~/server/api/trpc";
import {
  BookingCreationSchema,
  BookingUpdateSchema,
  TimeZoneOptions,
  BookingGetAllSchema,
  BookingCompletionSchema,
  type CastrationCompletionSchema,
} from "~/schemas/bookingSchema";
import { BookingType, UserRoles, BookingStatus } from "@prisma/client";
import dayjs from "dayjs";
import { string } from "zod";
import sendEmail from "~/server/email";
import {
  BookingErrors,
  BookingErrorHandlers,
  BookingStatusQueries,
  getBooking,
} from "~/utils/schemas/bookingUtils";
import { isVet } from "~/utils/schemas/usersUtils";
import { type InquirieCompletionSchema } from "~/schemas/inquirieSchema";
import { type DewormingCompletionSchema } from "~/schemas/dewormingSchema";
import { type VaccineCompletionSchema } from "~/schemas/vaccineSchema";
import { UrgencySchema } from "~/schemas/urgencySchema";

export const bookingsRouter = createTRPCRouter({
  create: clientProcedure
    .input(BookingCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { dog, user, ...booking } = input;
      const bookingDate = dayjs(booking.date);

      const dogData = await ctx.prisma.pet
        .findFirstOrThrow({
          where: {
            id: dog,
          },
        })
        .catch(() => {
          throw new Error("El perro no existe!");
        });

      BookingErrorHandlers.checkDate(bookingDate);
      BookingErrorHandlers.isAlreadyCastrated(booking.type, dogData.castrated);
      await BookingErrorHandlers.isAlreadyBooked(ctx.prisma, booking, dog);
      await BookingErrorHandlers.checkMaxBookings(ctx.prisma, booking);

      if (booking.type === BookingType.VACCINE) {
        if (booking.vaccineType === "B") {
          await BookingErrorHandlers.checkVaccineB(
            ctx.prisma,
            booking,
            dogData
          );
        }
      }

      return ctx.prisma.booking.create({
        data: {
          ...booking,
          dog: {
            connect: { id: dog },
          },
          user: {
            connect: {
              id:
                ctx.session.user.role === UserRoles.VET
                  ? user
                  : ctx.session.user.id,
            },
          },
        },
      });
    }),

  //Returns all future bookings
  getAll: publicProcedure
    .input(BookingGetAllSchema)
    .query(async ({ ctx, input: { status } }) => {
      const bookings = ctx.prisma.booking.findMany({
        where: {
          userId: isVet(ctx.session?.user) ? undefined : ctx.session?.user.id,
          ...BookingStatusQueries[status],
        },
        include: {
          dog: true,
          user: true,
        },
      });

      //Sort the bookings by date
      // TODO: sort with database queries
      await bookings.then((bookings) => {
        bookings.sort((a, b) => {
          const dateA = dayjs(a.date);
          const dateB = dayjs(b.date);

          if (dateA.isBefore(dateB)) {
            return -1;
          }
          if (dateA.isAfter(dateB)) {
            return 1;
          }
          return 0;
        });
      });

      return bookings;
    }),

  // Update a booking
  update: clientProcedure
    .input(BookingUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        dog,
        booking: { id, ...newData },
      } = input;
      const booking = await getBooking(ctx.prisma, id);
      const dogData = await ctx.prisma.pet
        .findFirstOrThrow({
          where: {
            id: dog,
          },
        })
        .catch(() => {
          throw new Error("El perro no existe!");
        });

      if (booking.status === BookingStatus.APPROVED) {
        BookingErrorHandlers.canUpdate(dayjs(booking.date));
      }
      BookingErrorHandlers.isAlreadyCastrated(booking.type, dogData.castrated);
      await BookingErrorHandlers.isAlreadyBooked(ctx.prisma, newData, dog);
      await BookingErrorHandlers.checkMaxBookings(ctx.prisma, newData);

      if (newData.type === BookingType.VACCINE) {
        if (newData.vaccineType === "B") {
          await BookingErrorHandlers.checkVaccineB(
            ctx.prisma,
            newData,
            dogData
          );
        }
      }

      return ctx.prisma.booking.update({
        where: {
          id,
        },
        data: {
          ...newData,
          status: BookingStatus.PENDING,
          dog: {
            connect: { id: dog },
          },
        },
      });
    }),

  // Cancel a booking
  cancel: protectedProcedure
    .input(string()) //BookingSchema ID
    .mutation(async ({ input, ctx }) => {
      const booking = await getBooking(ctx.prisma, input);
      const bookingDate = dayjs(booking.date);
      // BookingErrorHandlers.checkDate(bookingDate);

      if (booking.status === BookingStatus.APPROVED) {
        BookingErrorHandlers.canUpdate(bookingDate);
      }
      //Look for the user email
      const user = await ctx.prisma.user
        .findFirstOrThrow({
          where: {
            id: booking.userId ?? "",
          },
        })
        .catch(() => {
          throw new Error("El usuario no existe!");
        });

      const to =
        ctx.session.user.role === UserRoles.VET
          ? user.email
          : "v.ohmydog@gmail.com";

      const sender =
        ctx.session.user.role === UserRoles.VET ? "veterinario" : "cliente";

      await sendEmail({
        to,
        from: "v.ohmydog@gmail.com",
        subject: `Se ha cancelado el turno reservado por ${user.name}.`,
        text: `El turno del día ${bookingDate.format("DD/MM/YYYY")}, horario ${
          TimeZoneOptions.find((option) => option.value === booking.timeZone)
            ?.label as string
        }. Ha sido cancelado. Por favor, contacte con el ${sender} para reprogramar el turno.`,
      });

      return ctx.prisma.booking.update({
        where: {
          id: input,
        },
        data: {
          status: BookingStatus.CANCELLED,
        },
      });
    }),

  approve: vetProcedure
    .input(string()) //BookingSchema ID
    .mutation(async ({ input, ctx }) => {
      const booking = await getBooking(ctx.prisma, input);
      const bookingDate = dayjs(booking.date);
      // BookingErrorHandlers.checkDate(bookingDate);

      //Look for the user email
      const user = await ctx.prisma.user
        .findFirstOrThrow({
          where: {
            id: booking.userId ?? "",
          },
        })
        .catch(() => {
          throw new Error("El usuario no existe!");
        });

      const to =
        ctx.session.user.role === UserRoles.VET
          ? user.email
          : "v.ohmydog@gmail.com";

      await sendEmail({
        to,
        from: "v.ohmydog@gmail.com",
        subject: `Se ha aprobado el turno reservado por ${user.name}.`,
        text: `El turno del día ${bookingDate.format("DD/MM/YYYY")}, horario ${
          TimeZoneOptions.find((option) => option.value === booking.timeZone)
            ?.label as string
        }. Ha sido aprobado. Muchas gracias por confiar en nosotros!`,
      });
      return ctx.prisma.booking.update({
        where: {
          id: input,
        },
        data: {
          status: BookingStatus.APPROVED,
        },
      });
    }),

  get: publicProcedure.input(string()).query(async ({ input, ctx }) => {
    return await ctx.prisma.booking
      .findFirstOrThrow({
        where: {
          id: input,
        },
        include: {
          dog: true,
          user: true,
          castration: true,
          deworming: true,
          vaccine: true,
          inquirie: true,
        },
      })
      .catch(() => {
        throw new Error(BookingErrors.NOT_FOUND);
      });
  }),

  createUrgency: vetProcedure
    .input(UrgencySchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.$transaction(
        async (prisma) => {
          const booking = await prisma.booking.create({
            data: {
              date: new Date(),
              timeZone: input.timeZone,
              status: BookingStatus.COMPLETED,
              type: BookingType.URGENCY,
              vaccineType: input.vaccineType,
              payAmount: input.payAmount,
              ...(input.urgency.clientId
                ? {
                    user: {
                      connect: {
                        id: input.urgency.clientId,
                      },
                    },
                  }
                : {}),
              ...(input.urgency.petId
                ? {
                    dog: {
                      connect: {
                        id: input.urgency.petId,
                      },
                    },
                  }
                : {}),
              weight: input.weight,
            },
          });
          const connectBooking = {
            booking: {
              connect: {
                id: booking.id,
              },
            },
          };

          if (input.castration) {
            await prisma.castration.create({
              data: {
                ...connectBooking,
                ...input.castration,
              },
            });
          }

          if (input.deworming) {
            await prisma.deworming.create({
              data: {
                ...connectBooking,
                ...input.deworming,
              },
            });
          }

          if (input.vaccine) {
            await prisma.vaccine.create({
              data: {
                ...connectBooking,
                ...input.vaccine,
              },
            });
          }

          if (input.general) {
            await prisma.inquirie.create({
              data: {
                ...connectBooking,
                ...input.general,
              },
            });
          }
          if (input.urgency.clientId) {
            await prisma.user.update({
              where: {
                id: input.urgency.clientId,
              },
              data: {
                discountAmount: 0,
              },
            });
          }
          if (input.urgency.petId) {
            await prisma.pet.update({
              where: {
                id: input.urgency.petId,
              },
              data: {
                weight: input.weight,
                height: input.general?.height,
                castrated: input.castration?.succesful,
              },
            });
          }
        },
        {
          maxWait: 15000,
          timeout: 25000,
        }
      );
    }),

  complete: vetProcedure
    .input(BookingCompletionSchema)
    .mutation(async ({ input, ctx }) => {
      const booking = await getBooking(ctx.prisma, input.bookingId);

      switch (booking.type) {
        case BookingType.CASTRATION:
          const castration = input.castration as CastrationCompletionSchema;
          await ctx.prisma.castration.create({
            data: {
              booking: {
                connect: {
                  id: input.bookingId,
                },
              },
              succesful: castration.succesful,
            },
          });
          break;
        case BookingType.GENERAL:
          const general = input.general as InquirieCompletionSchema;
          await ctx.prisma.inquirie.create({
            data: {
              booking: {
                connect: {
                  id: input.bookingId,
                },
              },
              height: general.height,
              observations: general.observations,
            },
          });
          break;
        case BookingType.DEWORMING:
          const deworming =
            input.deworming as unknown as DewormingCompletionSchema;
          await ctx.prisma.deworming.create({
            data: {
              booking: {
                connect: {
                  id: input.bookingId,
                },
              },
              product: deworming.product,
              dosis: deworming.dosis,
            },
          });
          break;
        case BookingType.VACCINE:
          const vaccine = input.vaccine as unknown as VaccineCompletionSchema;
          await ctx.prisma.vaccine.create({
            data: {
              booking: {
                connect: {
                  id: input.bookingId,
                },
              },
              dosis: vaccine.dosis,
            },
          });
          break;
      }
      if (booking.dogId) {
        await ctx.prisma.pet.update({
          where: {
            id: booking.dogId,
          },
          data: {
            weight: input.weight,
            height: input.general?.height,
            castrated: input.castration?.succesful,
          },
        });
      }
      if (booking.userId) {
        await ctx.prisma.user.update({
          where: {
            id: booking.userId,
          },
          data: {
            discountAmount: 0,
          },
        });
      }

      return ctx.prisma.booking.update({
        where: {
          id: input.bookingId,
        },
        data: {
          status: BookingStatus.COMPLETED,
          weight: input.weight,
          payAmount: input.payAmount,
        },
      });
    }),
});
