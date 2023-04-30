export type FC<P = {}> = P & {
  className?: string;
  children?: React.ReactNode;
};

export type Sizes = "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
