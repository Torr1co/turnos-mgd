import { PET_ICONS } from "~/lib/icons";
import { type Icon } from "./types";

export const cn = (
  ...classes: Array<false | null | undefined | string>
): string => classes.filter(Boolean).join(" ");

export const getDogIcon = (objectId: string) => {
  const iconPosition = +objectId.replace(/[^0-9]/g, "") % PET_ICONS.length;
  console.log(iconPosition);
  return PET_ICONS[iconPosition] as (props: Icon<object>) => JSX.Element;
};
