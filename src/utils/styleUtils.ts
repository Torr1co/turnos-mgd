import { PET_ICONS } from "~/components/_common/icons";
import { type Icon } from "./language/types";
export const cn = (
  ...classes: Array<false | null | undefined | string>
): string => classes.filter(Boolean).join(" ");

export const getDogIcon = (objectId: string) => {
  const iconPosition = +objectId.replace(/[^0-9]/g, "") % PET_ICONS.length;
  return PET_ICONS[iconPosition] as (props: Icon<object>) => JSX.Element;
};
