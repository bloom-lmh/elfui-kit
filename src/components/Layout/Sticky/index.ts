// elf-sticky - Affix-compatible sticky positioning

import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  globalStyle,
  html,
  onBeforeUnmount,
  onMount,
  projectLightDom,
  useEffect,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef
} from "elfui";

import styles from "./style.scss?inline";
import type {
  StickyAppendTarget,
  StickyExpose,
  StickyPosition,
  StickyProps,
  StickyScrollDetail,
  StickySlots
} from "./types";

export type {
  StickyAppendTarget,
  StickyExpose,
  StickyPosition,
  StickyProps,
  StickyScrollDetail,
  StickySlots
} from "./types";

interface StickyGeometry {
  left: number;
  top: number;
  width: number;
  height: number;
}

const props = defineProps<StickyProps>({
  offset: { type: [Number, String], default: undefined },
  position: { type: String, default: "top" },
  target: { type: String, default: "" },
  zIndex: { type: [Number, String], default: 100 },
  teleported: { type: Boolean, default: false },
  appendTo: { type: [String, Object], default: "body" },
  top: { type: [Number, String], default: 0 },
  bottom: { type: [Number, String], default: "" },
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits<{
  change: [fixed: boolean];
  scroll: [detail: StickyScrollDetail];
}>();

const host = useHost();
const fixed = useRef(false);
const hidden = useRef(false);
const placeholderHeight = useRef("0px");
const portalStyleState = useRef<Record<string, string>>({});

let cleanupListeners = (): void => {};
let scrollParent: Window | HTMLElement | null = null;
let targetElement: HTMLElement | null = null;
let ticking = false;
let animationFrame = 0;
let mounted = false;

const nextId = (): string => {
  const store = globalThis as typeof globalThis & { __elfStickyIdSeed?: number };
  store.__elfStickyIdSeed = (store.__elfStickyIdSeed ?? 0) + 1;
  return `elf-sticky-${store.__elfStickyIdSeed}`;
};

const id = nextId();
const portalSelector = `[data-elf-sticky="${id}"]`;

const cssSize = (value: unknown, fallback = "0px"): string => {
  if (value == null || value === "") return fallback;
  if (typeof value === "number") return `${Math.max(0, value)}px`;
  const text = String(value).trim();
  return /^-?\d+(?:\.\d+)?$/.test(text) ? `${Math.max(0, Number(text))}px` : text;
};

const readNumber = (value: unknown): number => {
  const number = Number.parseFloat(String(value ?? "0"));
  return Number.isFinite(number) ? Math.max(0, number) : 0;
};

const normalizedPosition = (): StickyPosition => {
  if (props.bottom !== "" && props.bottom != null && props.offset == null) return "bottom";
  return props.position === "bottom" ? "bottom" : "top";
};

const normalizedOffset = (): string => {
  if (props.offset != null && props.offset !== "") return cssSize(props.offset);
  return normalizedPosition() === "bottom" ? cssSize(props.bottom) : cssSize(props.top);
};

const offsetNumber = (): number => {
  if (props.offset != null && props.offset !== "") return readNumber(props.offset);
  return normalizedPosition() === "bottom" ? readNumber(props.bottom) : readNumber(props.top);
};

const queryScoped = <T extends Element>(selector: string): T | null => {
  if (!selector) return null;
  const root = host.getRootNode() as Document | ShadowRoot;
  return root.querySelector<T>(selector) ?? document.querySelector<T>(selector);
};

const resolveTarget = (): HTMLElement | null => queryScoped<HTMLElement>(String(props.target || ""));

const resolveAppendTarget = (): HTMLElement => {
  if (typeof HTMLElement !== "undefined" && props.appendTo instanceof HTMLElement) return props.appendTo;
  return queryScoped<HTMLElement>(String(props.appendTo || "body")) ?? document.body;
};

const portalElement = (): HTMLElement | null => {
  const appendTarget = resolveAppendTarget();
  return appendTarget.querySelector<HTMLElement>(portalSelector) ?? queryScoped<HTMLElement>(portalSelector);
};

const portalStyle = (): Record<string, string> => portalStyleState.value;
const portalFixed = (): string => String(fixed.value);

const projection = projectLightDom(host, {
  defaultTarget: portalElement
});

const isScrollable = (element: HTMLElement): boolean => {
  const computed = window.getComputedStyle(element);
  return /(auto|scroll|overlay)/.test(`${computed.overflow} ${computed.overflowY} ${computed.overflowX}`);
};

const findScrollParent = (): Window | HTMLElement => {
  let parent = host.parentElement;
  while (parent && parent !== document.body && parent !== document.documentElement) {
    if (isScrollable(parent)) return parent;
    parent = parent.parentElement;
  }
  return window;
};

const composedParent = (element: HTMLElement): HTMLElement | null => {
  if (element.parentElement) return element.parentElement;
  const root = element.getRootNode();
  return root instanceof ShadowRoot ? root.host as HTMLElement : null;
};

const scrollAncestors = (...elements: Array<HTMLElement | null>): Array<Window | HTMLElement> => {
  const ancestors = new Set<Window | HTMLElement>([window]);
  for (const element of elements) {
    let parent = element ? composedParent(element) : null;
    while (parent && parent !== document.body && parent !== document.documentElement) {
      if (isScrollable(parent)) ancestors.add(parent);
      parent = composedParent(parent);
    }
  }
  return [...ancestors];
};

const scrollTop = (): number =>
  scrollParent === window || !scrollParent
    ? window.scrollY || document.documentElement.scrollTop
    : scrollParent.scrollTop;

const viewportBounds = (): { top: number; bottom: number } => {
  if (scrollParent === window || !scrollParent) return { top: 0, bottom: window.innerHeight };
  const rect = scrollParent.getBoundingClientRect();
  return { top: rect.top + scrollParent.clientTop, bottom: rect.bottom - scrollParent.clientTop };
};

const readGeometry = (): StickyGeometry => {
  const rect = host.getBoundingClientRect();
  const portalRect = portalElement()?.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: portalRect?.height || rect.height
  };
};

const updateRoot = (): void => {
  targetElement = resolveTarget();
};

const updatePortalStyle = (geometry: StickyGeometry, nextFixed: boolean): void => {
  if (!props.teleported) return;
  const bounds = viewportBounds();
  const offset = offsetNumber();
  const targetRect = targetElement?.getBoundingClientRect();
  let top = geometry.top;

  if (normalizedPosition() === "top" && nextFixed) {
    top = bounds.top + offset;
    if (targetRect) top = Math.min(top, targetRect.bottom - geometry.height);
  } else if (normalizedPosition() === "bottom" && nextFixed) {
    top = bounds.bottom - offset - geometry.height;
    if (targetRect) top = Math.max(top, targetRect.top);
  }

  const nextHidden = Boolean(
    targetRect &&
      (normalizedPosition() === "top"
        ? targetRect.bottom <= bounds.top + offset
        : targetRect.top >= bounds.bottom - offset)
  );
  hidden.set(nextHidden);
  placeholderHeight.set(`${Math.max(0, geometry.height)}px`);
  portalStyleState.set({
    position: "fixed",
    left: `${geometry.left}px`,
    top: `${top}px`,
    width: `${geometry.width}px`,
    zIndex: String(props.zIndex || 100),
    visibility: nextHidden ? "hidden" : "visible"
  });
};

const update = (): void => {
  ticking = false;
  if (typeof window === "undefined") return;
  updateRoot();
  const geometry = readGeometry();
  const bounds = viewportBounds();
  const offset = offsetNumber();
  const nextFixed = !props.disabled && (
    normalizedPosition() === "bottom"
      ? geometry.top + geometry.height >= bounds.bottom - offset
      : geometry.top <= bounds.top + offset
  );

  updatePortalStyle(geometry, nextFixed);
  if (props.disabled) hidden.set(false);
  if (nextFixed !== fixed.peek()) {
    fixed.set(nextFixed);
    emit("change", nextFixed);
  }
  emit("scroll", { scrollTop: scrollTop(), fixed: nextFixed });
};

const requestUpdate = (): void => {
  if (ticking || typeof requestAnimationFrame === "undefined") return;
  ticking = true;
  animationFrame = requestAnimationFrame(update);
};

const syncProjection = (): void => {
  queueMicrotask(() => {
    if (props.teleported) {
      if (!projection.project()) queueMicrotask(() => projection.project());
    } else {
      projection.restore();
    }
    requestUpdate();
  });
};

const connectListeners = (): void => {
  cleanupListeners();
  scrollParent = findScrollParent();
  const ancestors = scrollAncestors(host, targetElement);
  for (const ancestor of ancestors) {
    ancestor.addEventListener("scroll", requestUpdate, { passive: true });
  }
  window.addEventListener("resize", requestUpdate, { passive: true });
  cleanupListeners = () => {
    for (const ancestor of ancestors) ancestor.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", requestUpdate);
  };
};

useHostCssVar("--sticky-offset", normalizedOffset);
useHostCssVar("--sticky-top", () => normalizedPosition() === "top" ? normalizedOffset() : "auto");
useHostCssVar("--sticky-bottom", () => normalizedPosition() === "bottom" ? normalizedOffset() : "auto");
useHostCssVar("--sticky-z-index", () => String(props.zIndex || 100));
useHostCssVar("--sticky-placeholder-height", () => props.teleported ? placeholderHeight.value : "auto");
useHostAttr("data-position", normalizedPosition);
useHostFlag("disabled", () => Boolean(props.disabled));
useHostFlag("data-bottom", () => normalizedPosition() === "bottom");
useHostFlag("data-stuck", () => fixed.value);
useHostFlag("data-teleported", () => Boolean(props.teleported));
useHostFlag("data-hidden", () => hidden.value);

useEffect(() => {
  void props.target;
  void props.appendTo;
  void props.teleported;
  updateRoot();
  if (mounted) connectListeners();
  syncProjection();
});

onMount(() => {
  if (typeof window === "undefined") return;
  mounted = true;
  updateRoot();
  connectListeners();
  syncProjection();
});

onBeforeUnmount(() => {
  mounted = false;
  cleanupListeners();
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = 0;
  ticking = false;
  projection.restore();
  portalElement()?.remove();
});

defineExpose<StickyExpose>({ update, updateRoot });
defineStyle(styles);
globalStyle(styles);

const Sticky = defineHtml<StickyProps, Record<string, never>, StickySlots>(html`
  <div v-if=${!props.teleported} class="sticky" part="root"><slot></slot></div>
  <div v-if=${props.teleported} class="placeholder" part="placeholder"></div>
  <Teleport :to=${resolveAppendTarget()}>
    <div
      v-if=${props.teleported}
      class="elf-sticky-portal"
      :data-elf-sticky=${id}
      :data-fixed=${portalFixed()}
      :style=${portalStyle()}
    ></div>
  </Teleport>
`);

export { Sticky };
