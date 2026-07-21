export interface ListItemProps {
  title: string;
  subtitle: string;
  value: string | number;
  active: boolean;
  disabled: boolean;
  clickable: boolean;
  lines: "one" | "two" | "three";
}

export interface ListItemEmits {
  click: [MouseEvent];
  select: [string | number];
}
