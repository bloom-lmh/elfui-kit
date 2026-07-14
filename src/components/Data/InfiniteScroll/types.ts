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

export type InfiniteScrollEmits = {
  load: [];
};

export interface InfiniteScrollSlots {
  default?: unknown;
}

export type InfiniteScrollDirectiveHandler = () => void;

export interface InfiniteScrollDirectiveOptions {
  handler: InfiniteScrollDirectiveHandler;
  disabled?: boolean;
  distance?: number;
  delay?: number;
  immediate?: boolean;
}

export type InfiniteScrollDirectiveValue = InfiniteScrollDirectiveHandler | InfiniteScrollDirectiveOptions;
