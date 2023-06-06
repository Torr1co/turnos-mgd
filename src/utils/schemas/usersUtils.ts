import { UserRoles, type User } from "@prisma/client";

export const isVet = <T extends Partial<User> & { role: UserRoles } = User>(
  user?: T
) => user?.role === UserRoles.VET;

export const isClient = <T extends Partial<User> & { role: UserRoles } = User>(
  user?: T
) => user?.role === UserRoles.CLIENT;
