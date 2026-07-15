export type AnchoredPlacement =
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "top"
  | "top-start"
  | "top-end";

export interface OverlayRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface OverlayViewport {
  width: number;
  height: number;
  offsetLeft?: number;
  offsetTop?: number;
}

export interface AnchoredPositionOptions {
  placement: AnchoredPlacement;
  offset?: readonly [crossAxis: number, mainAxis: number];
  padding?: number;
  flip?: boolean;
  fallbackPlacements?: readonly AnchoredPlacement[];
}

export interface AnchoredPosition {
  left: number;
  top: number;
  placement: AnchoredPlacement;
}

const oppositePlacement = (placement: AnchoredPlacement): AnchoredPlacement =>
  placement.startsWith("top")
    ? placement.replace("top", "bottom") as AnchoredPlacement
    : placement.replace("bottom", "top") as AnchoredPlacement;

const rawPosition = (
  anchor: OverlayRect,
  overlay: Pick<OverlayRect, "width" | "height">,
  placement: AnchoredPlacement,
  offset: readonly [number, number]
): Pick<AnchoredPosition, "left" | "top"> => {
  const [crossAxis, mainAxis] = offset;
  const isTop = placement.startsWith("top");
  const isEnd = placement.endsWith("end");
  const isCenter = placement === "top" || placement === "bottom";
  const left = isEnd
    ? anchor.right - overlay.width
    : isCenter
      ? anchor.left + (anchor.width - overlay.width) / 2
      : anchor.left;
  return {
    left: left + crossAxis,
    top: isTop
      ? anchor.top - overlay.height - mainAxis
      : anchor.bottom + mainAxis
  };
};

const overflowScore = (
  position: Pick<AnchoredPosition, "left" | "top">,
  overlay: Pick<OverlayRect, "width" | "height">,
  viewport: OverlayViewport,
  padding: number
): number => {
  const minLeft = (viewport.offsetLeft || 0) + padding;
  const minTop = (viewport.offsetTop || 0) + padding;
  const maxRight = (viewport.offsetLeft || 0) + viewport.width - padding;
  const maxBottom = (viewport.offsetTop || 0) + viewport.height - padding;
  return Math.max(0, minLeft - position.left)
    + Math.max(0, minTop - position.top)
    + Math.max(0, position.left + overlay.width - maxRight)
    + Math.max(0, position.top + overlay.height - maxBottom);
};

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(value, Math.max(min, max)));

export const computeAnchoredPosition = (
  anchor: OverlayRect,
  overlay: Pick<OverlayRect, "width" | "height">,
  viewport: OverlayViewport,
  options: AnchoredPositionOptions
): AnchoredPosition => {
  const padding = Math.max(0, Number(options.padding) || 0);
  const offset = options.offset || [0, 6];
  const placements = options.flip === false
    ? [options.placement]
    : Array.from(new Set([
        options.placement,
        ...(options.fallbackPlacements || []),
        oppositePlacement(options.placement)
      ]));
  const candidates = placements.map((placement) => ({
    placement,
    position: rawPosition(anchor, overlay, placement, offset)
  }));
  const best = candidates.reduce((current, candidate) =>
    overflowScore(candidate.position, overlay, viewport, padding)
      < overflowScore(current.position, overlay, viewport, padding)
      ? candidate
      : current
  );
  const placement = best.placement;
  const position = best.position;
  const viewportLeft = viewport.offsetLeft || 0;
  const viewportTop = viewport.offsetTop || 0;

  return {
    left: clamp(position.left, viewportLeft + padding, viewportLeft + viewport.width - overlay.width - padding),
    top: clamp(position.top, viewportTop + padding, viewportTop + viewport.height - overlay.height - padding),
    placement
  };
};
