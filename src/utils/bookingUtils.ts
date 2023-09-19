import { type PrismaClient } from "@prisma/client";
import dayjs, { type Dayjs } from "dayjs";
import { type BookingPaymentCreationSchema } from "~/schemas";

export const BookingsLocalData = {
  getMine() {
    const localBookings = localStorage.getItem("myLocalBookings");
    return localBookings ? (JSON.parse(localBookings) as string[]) : null;
  },
  addById(bookingId: string) {
    const localBookings = this.getMine();
    localBookings
      ? localStorage.setItem(
          "myLocalBookings",
          JSON.stringify([...localBookings, bookingId])
        )
      : localStorage.setItem("myLocalBookings", JSON.stringify([bookingId]));
  },
} as const;

export function getBookingQueryParams(
  data: Omit<BookingPaymentCreationSchema, "data.id">
) {
  return `date=${data.date.toString()}&schedule=${data.schedule}&serviceId=${
    data.serviceId
  }&amount=${data.amount}${data.username ? "&username=" + data.username : ""}${
    data.userId ? "&userId=" + data.userId : ""
  }`;
}

export const BookingErrors = {
  NOT_FOUND: "El turno no fue encontrada.",
  FULL: "Horario ocupado!",
  LAST_DAY:
    "No puedes cancelar o modificar el turno con menos de 24 horas de anticipación!",
  ALREADY_BOOKED: "Ya tienes un turno ese día!",
  PAST_DATE: "El turno se encuentra en el pasado!",
} as const;

export function canUpdate(date: Date | Dayjs) {
  return (
    dayjs(date).isAfter(dayjs().add(1, "day"), "day") ||
    dayjs(date).isBefore(dayjs(), "day")
  );
}

export function bookingUpdateHandler(date: Date | Dayjs) {
  if (!canUpdate(date)) throw new Error(BookingErrors.LAST_DAY);
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
