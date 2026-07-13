export interface CalendarProps {
  modelValue: string;
  firstDayOfWeek: number;
  disabledDate?: (date: Date) => boolean;
  locale: string;
  ariaLabel: string;
}
