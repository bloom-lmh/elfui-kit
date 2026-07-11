export type ColorFormat = "hex" | "rgb";

export interface ColorPreset {
  label?: string;
  value: string;
}

export interface ColorPickerProps {
  modelValue: string;
  format: ColorFormat;
  presets: Array<string | ColorPreset>;
  showAlpha: boolean;
  disabled: boolean;
  clearable: boolean;
}
