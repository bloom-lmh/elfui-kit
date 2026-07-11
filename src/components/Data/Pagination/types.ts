export type PaginationLayoutPart = "total" | "sizes" | "prev" | "pager" | "next" | "jumper";

export interface PaginationProps {
  total: number;
  currentPage: number;
  pageSize: number;
  pageSizes: number[];
  pagerCount: number;
  layout: string;
  background: boolean;
  small: boolean;
  disabled: boolean;
  hideOnSinglePage: boolean;
}
