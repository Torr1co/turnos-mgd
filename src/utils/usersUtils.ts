import { UserRoles, type User } from "@prisma/client";

export const isAdmin = <T extends Partial<User> & { role: UserRoles } = User>(
  user?: T
) => user?.role === UserRoles.ADMIN;

export const isClient = <T extends Partial<User> & { role: UserRoles } = User>(
  user?: T
) => user?.role === UserRoles.CLIENT;
