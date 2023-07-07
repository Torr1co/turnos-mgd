import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "~/server/db";
// import { prisma } from "~/server/db";

interface QueryProps {
  campaignId: string;
  userId: string;
  amount: string;
  ["data.id"]: string;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const query = req.query as unknown as QueryProps;
    const { campaignId, userId, amount } = query;
    await prisma.donation.create({
      data: {
        amount: parseInt(amount),
        paymentId: query["data.id"],
        campaign: {
          connect: {
            id: campaignId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return res.status(200).json({});
  }
}
