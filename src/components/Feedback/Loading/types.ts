export type LoadingVariant = "spinner" | "dots" | "pulse" | "bars";

export interface LoadingProps {
  loading: boolean;
  text: string;
  fullscreen: boolean;
  background: string;
  closable: boolean;
  variant: LoadingVariant;
}
