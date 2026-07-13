export interface CalendarProps {
  modelValue: string | [string, string];
  firstDayOfWeek: number;
  range: boolean;
  disabledDate?: (date: Date) => boolean;
  locale: string;
  ariaLabel: string;
}
