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
}

export interface VirtualListExpose {
  scrollToIndex(index: number, behavior?: ScrollBehavior): void;
  scrollToOffset(offset: number, behavior?: ScrollBehavior): void;
}
