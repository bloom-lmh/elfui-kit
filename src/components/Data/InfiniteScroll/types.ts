export interface InfiniteScrollProps {
  disabled: boolean;
  distance: number;
  delay: number;
  immediate: boolean;
  loading: boolean;
  /** Scroll viewport height. Use `auto` only with an external container. */
  height: string | number;
  container: string | HTMLElement | null;
}
