export interface VirtualWindowOptions {
  count: number;
  itemSize: number;
  viewportSize: number;
  scrollOffset: number;
  overscan?: number;
}

export interface VirtualWindow {
  start: number;
  end: number;
  offset: number;
  totalSize: number;
}

const finite = (value: number, fallback = 0): number =>
  Number.isFinite(value) ? value : fallback;

/** Calculates a fixed-size virtual window. `end` is exclusive. */
export const computeVirtualWindow = (options: VirtualWindowOptions): VirtualWindow => {
  const count = Math.max(0, Math.floor(finite(options.count)));
  const itemSize = Math.max(1, finite(options.itemSize, 1));
  const viewportSize = Math.max(0, finite(options.viewportSize));
  const overscan = Math.max(0, Math.floor(finite(options.overscan ?? 4)));
  const maxOffset = Math.max(0, count * itemSize - viewportSize);
  const scrollOffset = Math.min(Math.max(0, finite(options.scrollOffset)), maxOffset);
  const visibleStart = Math.floor(scrollOffset / itemSize);
  const visibleCount = Math.max(1, Math.ceil(viewportSize / itemSize));
  const start = Math.max(0, visibleStart - overscan);
  const end = Math.min(count, visibleStart + visibleCount + overscan);

  return { start, end, offset: start * itemSize, totalSize: count * itemSize };
};
