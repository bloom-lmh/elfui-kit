export interface InfiniteScrollProps {
  disabled: boolean;
  distance: number;
  delay: number;
  immediate: boolean;
  loading: boolean;
  container: string | HTMLElement | null;
}
