export interface MentionOption {
  value?: string;
  label?: string;
  disabled?: boolean;
}

export interface MentionProps {
  modelValue: string;
  options: MentionOption[];
  prefix: string;
  placeholder: string;
  disabled: boolean;
  rows: number;
}
