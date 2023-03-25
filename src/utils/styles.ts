export const cn = (
  ...classes: Array<false | null | undefined | string>
): string => classes.filter(Boolean).join(" ");
