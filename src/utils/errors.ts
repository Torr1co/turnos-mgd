import { Prisma } from "@prisma/client";

export function prismaError(error: unknown, errorMessage: string) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.meta?.target
  ) {
    const target = error.meta.target as string;
    return function prismaHandler(key: string, message: string) {
      if (target.includes(key)) {
        throw new Error(message);
      }
    };
  }
  throw new Error(errorMessage);
}
