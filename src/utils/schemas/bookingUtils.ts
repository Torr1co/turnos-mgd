import { type BookingSchema } from "~/schemas/bookingSchema";
import { type Pet, type PrismaClient } from "@prisma/client";
import dayjs, { type Dayjs } from "dayjs";

const MAX_BOOKINGS_PER_DAY = 20;
export const BookingErrors = {
  NOT_FOUND: "El turno no fue encontrada.",
  FULL: "Horario ocupado!",
  LAST_DAY: "No puedes modificar un turno en menos de 24hs!",
  ALREADY_BOOKED: "Ya tienes un turno ese día!",
  PAST_DATE: "El turno se encuentra en el pasado!",
  SUNDAY: "No abrimos los domingos!",
  VACCINE_B_YOUNG:
    "No se puede aplicar una antirrabica a un perro menor de 4 meses!",
  VACCINE_B_LAST_YEAR:
    "No se puede aplicar una antirrabica a un perro que ya tiene una en el ultimo año!",
} as const;

export function canUpdateBooking(date: Date | Dayjs) {
  return dayjs(date).isAfter(dayjs().add(1, "day"), "day");
}

export async function getBooking(prisma: PrismaClient, id: string) {
  return await prisma.booking
    .findFirstOrThrow({
      where: {
        id,
      },
    })
    .catch(() => {
      throw new Error(BookingErrors.NOT_FOUND);
    });
}

function bookingDateHandler(date: Dayjs) {
  if (date.isBefore(dayjs(), "day")) throw new Error(BookingErrors.PAST_DATE);
  if (date.day() === 0) throw new Error(BookingErrors.SUNDAY);
}

function bookingUpdateHandler(date: Dayjs) {
  if (!canUpdateBooking(dayjs(date))) throw new Error(BookingErrors.LAST_DAY);
  bookingDateHandler(dayjs(date));
}

function isPuppyHandler(birthDate: Date) {
  if (dayjs(birthDate).isAfter(dayjs().subtract(4, "month"))) {
    throw new Error(BookingErrors.VACCINE_B_YOUNG);
  }
}
async function alreadyBookedHandler(
  prisma: PrismaClient,
  booking: BookingSchema,
  dogId: string
) {
  const alreadyBooked = await prisma.booking.findFirst({
    where: {
      dog: {
        id: dogId,
      },
      date: {
        gt: dayjs(booking.date).startOf("day").toDate(),
        lt: dayjs(booking.date).endOf("day").toDate(),
      },
      timeZone: {
        equals: booking.timeZone,
      },
    },
  });
  if (alreadyBooked) throw new Error(BookingErrors.ALREADY_BOOKED);
}

async function maxBookingsHandler(
  prisma: PrismaClient,
  booking: BookingSchema
) {
  const bookingsInSamedate = await prisma.booking.count({
    where: {
      date: {
        gt: dayjs(booking.date).startOf("day").toDate(),
        lt: dayjs(booking.date).endOf("day").toDate(),
      },
      timeZone: {
        equals: booking.timeZone,
      },
    },
  });
  if (bookingsInSamedate >= MAX_BOOKINGS_PER_DAY)
    throw new Error(BookingErrors.FULL);
}

async function vaccineBHandler(
  prisma: PrismaClient,
  booking: BookingSchema,
  pet: Pet
) {
  isPuppyHandler(pet.birth);
  const alreadyHasVaccineB = await prisma.booking.findFirst({
    where: {
      dog: {
        id: pet.id,
      },
      vaccine: {
        equals: "B",
      },
      date: {
        gte: dayjs(booking.date).subtract(1, "year").toDate(),
      },
    },
  });
  if (alreadyHasVaccineB) {
    throw new Error(BookingErrors.VACCINE_B_LAST_YEAR);
  }
}

export const BookingHandlers = {
  date: bookingDateHandler,
  update: bookingUpdateHandler,
  puppy: isPuppyHandler,
  alreadyBooked: alreadyBookedHandler,
  maxBookings: maxBookingsHandler,
  vaccineB: vaccineBHandler,
};
