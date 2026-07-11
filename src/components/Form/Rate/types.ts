export type RateSize = "sm" | "md" | "lg";

export interface RateProps {
  modelValue: number;
  max: number;
  allowHalf: boolean;
  clearable: boolean;
  disabled: boolean;
  readonly: boolean;
  size: RateSize;
  color: string;
  voidColor: string;
  disabledColor: string;
  character: string;
  voidCharacter: string;
  showText: boolean;
  showScore: boolean;
  scoreTemplate: string;
  texts: string[];
}
