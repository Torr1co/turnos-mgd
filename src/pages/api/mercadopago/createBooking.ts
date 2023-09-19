import dayjs from "dayjs";
import { type NextApiRequest, type NextApiResponse } from "next";
import { type BookingPaymentCreationSchema } from "~/schemas";
import { bookingsRouter } from "~/server/api/routers/bookingsRouter";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const query = req.query as unknown as BookingPaymentCreationSchema;
    // const { bookingId, userId, amount } = query;
    const bookingCaller = bookingsRouter.createCaller({
      session: null,
      prisma,
    });

    await bookingCaller.create({
      date: dayjs(query.date).toDate(),
      schedule: query.schedule,
      serviceId: query.serviceId,
      userId: query.userId,
      username: query.username,
      payment: {
        id: query["data.id"],
        amount: Number(query.amount),
      },
    });

    return res.status(200).json({});
  }
}
