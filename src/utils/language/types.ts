export type FC<P = object> = P & {
  className?: string;
  children?: React.ReactNode;
};

export type Icon<T = object> = T & {
  className?: string;
  width?: string;
  height?: string;
  color?: string;
  onClick?: () => void;
};

export type Sizes = "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
