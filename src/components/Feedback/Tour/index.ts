// elf-tour — 漫游式引导

import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  onBeforeUnmount,
  useEffect,
  useEscapeKey,
  useEventListener,
  useHost,
  useHostFlag,
  useIntersectionObserver,
  useRef,
  useResizeObserver,
  useScrollLock,
  useTemplateRef
} from "elfui";

import styles from "./style.scss?inline";
import type { TourChangeDetail, TourPlacement, TourProps, TourStep } from "./types";

export type { TourChangeDetail, TourPlacement, TourProps, TourStep } from "./types";

interface TargetBox {
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

const props = defineProps<TourProps>({
  steps: { type: Array, default: () => [] as TourStep[] },
  visible: { type: Boolean, default: false },
  current: { type: Number, default: 0 },
  maskClosable: { type: Boolean, default: true },
  keyboard: { type: Boolean, default: true },
  lockScroll: { type: Boolean, default: true },
  gap: { type: Number, default: 12 },
  zIndex: { type: Number, default: 3000 }
});

const emit = defineEmits<{
  "update:current": [current: number];
  change: [detail: TourChangeDetail];
  close: [];
  finish: [];
}>();

const host = useHost();
const overlayRef = useTemplateRef<HTMLElement>("overlay");
const currentStep = useRef(0);
const rendered = useRef(false);
const closing = useRef(false);
const targetBox = useRef<TargetBox | null>(null);
const hostVisible = useRef(true);

let closeTimer: ReturnType<typeof setTimeout> | null = null;
let frameId = 0;
let previousActive: HTMLElement | null = null;
let lastPropCurrent = 0;

const steps = (): TourStep[] => (Array.isArray(props.steps) ? (props.steps as TourStep[]) : []);
const stepCount = (): number => steps().length;
const clampIndex = (index: number): number => {
  const max = Math.max(0, stepCount() - 1);
  return Math.min(max, Math.max(0, Math.trunc(index) || 0));
};
const activeStep = (): TourStep | null => steps()[currentStep.value] ?? null;
const placement = (): TourPlacement => {
  const value = activeStep()?.placement;
  return value === "top" || value === "left" || value === "right" ? value : "bottom";
};
const isFirstStep = (): boolean => currentStep.value <= 0;
const isLastStep = (): boolean => currentStep.value >= stepCount() - 1;
const currentNumber = (): number => currentStep.value + 1;
const nextButtonText = (): string => activeStep()?.nextText || (isLastStep() ? "完成" : "下一步");
const prevButtonText = (): string => activeStep()?.prevText || "上一步";

const clearCloseTimer = (): void => {
  if (closeTimer) clearTimeout(closeTimer);
  closeTimer = null;
};

const resolveTarget = (): Element | null => {
  const step = activeStep();
  if (!step?.target) return null;
  const root = host.getRootNode() as Document | ShadowRoot;
  return root.querySelector(step.target) || document.querySelector(step.target);
};

const updateTarget = (): void => {
  const el = resolveTarget();
  if (!el) {
    targetBox.set(null);
    return;
  }
  const rect = el.getBoundingClientRect();
  targetBox.set({
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    right: rect.right,
    bottom: rect.bottom
  });
};

const scheduleUpdate = (): void => {
  if (frameId) cancelAnimationFrame(frameId);
  frameId = requestAnimationFrame(() => {
    frameId = 0;
    updateTarget();
  });
};

const focusOverlay = (): void => {
  queueMicrotask(() => {
    const overlay = overlayRef.peek();
    const close = overlay?.querySelector<HTMLElement>(".tour-close");
    (close || overlay)?.focus();
  });
};

const restoreFocus = (): void => {
  if (previousActive && typeof previousActive.focus === "function") {
    previousActive.focus();
  }
  previousActive = null;
};

const open = (): void => {
  if (stepCount() === 0) return;
  clearCloseTimer();
  previousActive = document.activeElement as HTMLElement | null;
  lastPropCurrent = clampIndex(props.current);
  currentStep.set(lastPropCurrent);
  rendered.set(true);
  closing.set(false);
  scheduleUpdate();
  focusOverlay();
};

const close = (): void => {
  if (!rendered.peek() || closing.peek()) return;
  closing.set(true);
  clearCloseTimer();
  closeTimer = setTimeout(() => {
    rendered.set(false);
    closing.set(false);
    targetBox.set(null);
    restoreFocus();
    emit("close");
  }, 180);
};

const setCurrent = (index: number): void => {
  const next = clampIndex(index);
  if (next === currentStep.value) return;
  const step = steps()[next] ?? null;
  currentStep.set(next);
  emit("update:current", next);
  emit("change", { current: next, step });
  scheduleUpdate();
  focusOverlay();
};

const prev = (): void => setCurrent(currentStep.value - 1);

const finish = (): void => {
  emit("finish");
  close();
};

const next = (): void => {
  if (isLastStep()) {
    finish();
    return;
  }
  setCurrent(currentStep.value + 1);
};

const skip = (): void => close();

const onLayerClick = (event: MouseEvent): void => {
  if (props.maskClosable && event.target === event.currentTarget) close();
};

const onKeydown = (event: KeyboardEvent): void => {
  if (!props.keyboard || !rendered.value) return;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    event.preventDefault();
    next();
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    event.preventDefault();
    prev();
  }
};

const highlightStyle = (): Record<string, string> => {
  const box = targetBox.value;
  if (!box) return {};
  const gap = Math.max(0, Number(props.gap) || 0);
  return {
    left: `${Math.max(8, box.left - gap)}px`,
    top: `${Math.max(8, box.top - gap)}px`,
    width: `${Math.max(0, box.width + gap * 2)}px`,
    height: `${Math.max(0, box.height + gap * 2)}px`
  };
};

const bubbleStyle = (): Record<string, string> => {
  const box = targetBox.value;
  if (!box) {
    return {
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: String(props.zIndex + 2)
    };
  }
  const gap = Math.max(8, Number(props.gap) || 12) + 8;
  const p = placement();
  const viewportPadding = 16;
  const maxLeft = window.innerWidth - viewportPadding;
  const maxTop = window.innerHeight - viewportPadding;
  let left = box.left + box.width / 2;
  let top = box.bottom + gap;
  let transform = "translate(-50%, 0)";

  if (p === "top") {
    top = box.top - gap;
    transform = "translate(-50%, -100%)";
  } else if (p === "left") {
    left = box.left - gap;
    top = box.top + box.height / 2;
    transform = "translate(-100%, -50%)";
  } else if (p === "right") {
    left = box.right + gap;
    top = box.top + box.height / 2;
    transform = "translate(0, -50%)";
  }

  return {
    left: `${Math.min(maxLeft, Math.max(viewportPadding, left))}px`,
    top: `${Math.min(maxTop, Math.max(viewportPadding, top))}px`,
    transform,
    zIndex: String(props.zIndex + 2)
  };
};

const layerStyle = (): Record<string, string> => ({ zIndex: String(props.zIndex) });
const hasTarget = (): boolean => Boolean(targetBox.value);
const layerClass = (): Record<string, boolean> => ({ "is-closing": closing.value });

useEffect(() => {
  if (props.visible) open();
  else if (rendered.peek()) close();
});

useEffect(() => {
  const next = clampIndex(props.current);
  if (next === lastPropCurrent) return;
  lastPropCurrent = next;
  currentStep.set(next);
  scheduleUpdate();
});

useEscapeKey(() => {
  if (props.keyboard && rendered.value) close();
});
useScrollLock(() => Boolean(props.lockScroll) && rendered.value && !closing.value);
useEventListener(window, "scroll", scheduleUpdate, { passive: true });
useEventListener(window, "resize", scheduleUpdate);
useResizeObserver(host, scheduleUpdate);
useIntersectionObserver(host, (entry) => {
  hostVisible.set(entry.isIntersecting);
  scheduleUpdate();
});
useHostFlag("data-open", () => rendered.value);
useHostFlag("data-visible", () => hostVisible.value);

onBeforeUnmount(() => {
  clearCloseTimer();
  if (frameId) cancelAnimationFrame(frameId);
  restoreFocus();
});

defineExpose({ prev, next, skip, finish, close, open });
defineStyle(styles);

const Tour = defineHtml<TourProps>(html`
  <Teleport to="body">
    <div
      v-if=${rendered}
      ref="overlay"
      class="tour-layer"
      :class=${layerClass()}
      :style=${layerStyle()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      @click=${onLayerClick}
      @keydown=${onKeydown}
    >
      <div class="tour-backdrop"></div>
      <div v-if=${hasTarget()} class="tour-highlight" :style=${highlightStyle()}></div>
      <section class="tour-panel" :class=${placement()} :style=${bubbleStyle()}>
        <header class="tour-header">
          <span class="tour-progress">${currentNumber()} / ${stepCount()}</span>
          <button class="tour-close" type="button" aria-label="关闭引导" @click=${skip}>×</button>
        </header>
        <div class="tour-body">
          <h3 class="tour-title">${activeStep()?.title}</h3>
          <p class="tour-content">${activeStep()?.content}</p>
        </div>
        <footer class="tour-footer">
          <elf-button size="sm" variant="text" tabindex="0" @click=${skip}>跳过</elf-button>
          <span class="tour-spacer"></span>
          <elf-button
            size="sm"
            variant="text"
            tabindex="0"
            :disabled=${isFirstStep()}
            @click=${prev}
          >
            ${prevButtonText()}
          </elf-button>
          <elf-button size="sm" color="primary" tabindex="0" @click=${next}>
            ${nextButtonText()}
          </elf-button>
        </footer>
      </section>
    </div>
  </Teleport>
`);

export { Tour };
