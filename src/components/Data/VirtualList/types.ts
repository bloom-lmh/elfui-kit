import type { ListItemKey, ListItemRenderer } from "../List/types";

export interface VirtualListProps<T = unknown> {
  items: T[];
  itemKey: ListItemKey<T>;
  renderItem?: ListItemRenderer<T>;
  height: string | number;
  itemHeight: number;
  overscan: number;
  bordered: boolean;
  divided: boolean;
  emptyText: string;
  /** Class applied to every recycled row. */
  listItemClass: string;
  /** Inline style applied to every recycled row. */
  listItemStyle: string | Record<string, string | number>;
}

export interface VirtualListExpose {
  scrollToIndex(index: number, behavior?: ScrollBehavior): void;
  scrollToOffset(offset: number, behavior?: ScrollBehavior): void;
}
