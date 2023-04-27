export const hasKey = <T extends object>(obj: T, k: keyof any): k is keyof T =>
  k in obj;
