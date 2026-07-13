export type PaginationLayoutPart = "total" | "sizes" | "prev" | "pager" | "next" | "jumper";
export type PaginationSize = "" | "small" | "default" | "large";

export interface PaginationProps {
  total: number;
  currentPage: number;
  defaultCurrentPage: number;
  pageSize: number;
  defaultPageSize: number;
  pageCount: number;
  pageSizes: number[];
  pagerCount: number;
  layout: string;
  background: boolean;
  size: PaginationSize;
  small: boolean;
  prevText: string;
  nextText: string;
  disabled: boolean;
  hideOnSinglePage: boolean;
  ariaLabel: string;
}
