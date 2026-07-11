export interface StatisticProps {
  value: number;
  title: string;
  prefix: string;
  suffix: string;
  precision?: number;
  groupSeparator: string;
  decimalSeparator: string;
}

export interface StatisticSlots {
  title?: unknown;
  prefix?: unknown;
  suffix?: unknown;
}
