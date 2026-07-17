import type { FieldVariant } from "../../../types/field";

export type ColorFormat = "hex" | "rgb";
export type ColorPickerVariant = FieldVariant;

export interface ColorPreset {
  label?: string;
  value: string;
}

export interface ColorPickerProps {
  modelValue: string;
  format: ColorFormat;
  variant: ColorPickerVariant;
  label: string;
  presets: Array<string | ColorPreset>;
  showAlpha: boolean;
  disabled: boolean;
  clearable: boolean;
}
