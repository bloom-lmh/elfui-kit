import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  onBeforeUnmount,
  onMount,
  useComputed,
  useHost,
  useRef,
  watchEffect
} from "elfui";

import styles from "./style.scss?inline";

export type {
  CarouselArrow,
  CarouselArrowStyle,
  CarouselDirection,
  CarouselEffect,
  CarouselIndicatorPosition,
  CarouselIndicatorType,
  CarouselItemProps,
  CarouselProps,
  CarouselType,
  CarouselTrigger
} from "./types";

const props = defineProps({
  effect: { type: String, default: "slide" },
  type: { type: String, default: "" },
  autoplay: { type: Boolean, default: true },
  interval: { type: Number, default: 4000 },
  loop: { type: Boolean, default: true },
  showArrow: { type: String, default: "circle" },
  showIndicator: { type: Boolean, default: true },
  indicatorType: { type: String, default: "dot" },
  height: { type: String, default: "320px" },
  duration: { type: String, default: "0.5s" },
  pauseOnHover: { type: Boolean, default: true },
  radius: { type: String, default: "12px" },
  initialIndex: { type: Number, default: 0 },
  trigger: { type: String, default: "hover" },
  arrow: { type: String, default: "hover" },
  indicatorPosition: { type: String, default: "" },
  direction: { type: String, default: "horizontal" },
  ariaLabel: { type: String, default: "Carousel" }
});

const emit = defineEmits(["change"]);
const host = useHost();
const active = useRef(0);
const total = useRef(0);

let timer: ReturnType<typeof setInterval> | null = null;
let initialized = false;

const clearTimer = (): void => {
  if (timer) clearInterval(timer);
  timer = null;
};

const clampIndex = (index: number): number => {
  const max = Math.max(0, total.value - 1);
  return Math.min(max, Math.max(0, Math.trunc(Number(index)) || 0));
};

const slides = (): HTMLElement[] => Array.from(host.children) as HTMLElement[];

const isCardMode = (): boolean =>
  props.type === "card" && slides().length > 0 && slides().every((child) => child.tagName === "ELF-CAROUSEL-ITEM");

const cardOffset = (index: number): number => {
  let offset = index - active.value;
  if (props.loop && total.value > 2) {
    const half = total.value / 2;
    if (offset > half) offset -= total.value;
    if (offset < -half) offset += total.value;
  }
  return offset;
};

const syncSlides = (): void => {
  slides().forEach((slide, index) => {
    const isActive = index === active.value;
    slide.setAttribute("index", String(index));
    slide.setAttribute("total", String(total.value));
    slide.toggleAttribute("active", isActive);
    slide.setAttribute("aria-hidden", isActive ? "false" : "true");
  });
};

const applyCard = (): void => {
  if (!isCardMode()) {
    slides().forEach((slide) => {
      slide.style.removeProperty("--_card-offset");
      slide.style.removeProperty("--_card-opacity");
      slide.style.removeProperty("--_card-scale");
      slide.style.removeProperty("--_card-z-index");
    });
    return;
  }

  slides().forEach((slide, index) => {
    const offset = cardOffset(index);
    slide.style.setProperty("--_card-offset", String(offset));
    slide.style.setProperty("--_card-opacity", Math.abs(offset) <= 1 ? "1" : "0");
    slide.style.setProperty("--_card-scale", offset === 0 ? "1" : "0.84");
    slide.style.setProperty("--_card-z-index", String(total.value - Math.abs(offset)));
  });
};

const startTimer = (): void => {
  clearTimer();
  if (!props.autoplay || total.value <= 1) return;
  timer = setInterval(doNext, Math.max(0, Number(props.interval) || 0));
};

const setActive = (index: number): boolean => {
  const next = clampIndex(index);
  const previous = active.value;
  if (next === previous) return false;
  active.set(next);
  emit("change", next, previous);
  return true;
};

const doPrev = (): void => {
  if (total.value <= 1) return;
  const next = active.value > 0 ? active.value - 1 : props.loop ? total.value - 1 : active.value;
  if (setActive(next)) startTimer();
};

const doNext = (): void => {
  if (total.value <= 1) return;
  const next = active.value < total.value - 1 ? active.value + 1 : props.loop ? 0 : active.value;
  if (setActive(next)) startTimer();
  else clearTimer();
};

const goTo = (index: number): void => {
  if (index < 0 || index >= total.value) return;
  if (setActive(index)) startTimer();
};

const setActiveItem = (item: number | string): void => {
  if (typeof item === "number") {
    goTo(item);
    return;
  }
  const index = slides().findIndex(
    (child) => child.getAttribute("label") === item || child.getAttribute("name") === item
  );
  if (index >= 0) goTo(index);
};

const onEnter = (): void => {
  if (props.pauseOnHover) clearTimer();
};

const onLeave = (): void => {
  if (props.pauseOnHover) startTimer();
};

const updateTotal = (): void => {
  total.set(slides().length);
  if (!initialized) {
    active.set(clampIndex(props.initialIndex));
    initialized = true;
  } else if (active.value >= total.value) {
    active.set(clampIndex(active.value));
  }
  syncSlides();
  applyCard();
  startTimer();
};

const applyFade = (): void => {
  if (props.effect !== "fade") return;
  Array.from(host.children).forEach((child, index) => {
    const slide = child as HTMLElement;
    const isActive = index === active.value;
    slide.style.opacity = isActive ? "1" : "0";
    slide.style.pointerEvents = isActive ? "auto" : "none";
  });
};

const trackTransform = (): string =>
  isCardMode()
    ? ""
    : props.direction === "vertical"
    ? `translateY(-${active.value * 100}%)`
    : `translateX(-${active.value * 100}%)`;

const dots = useComputed(() => Array.from({ length: total.value }, (_, index) => index));
const showArrows = useComputed(
  () => props.arrow !== "never" && props.showArrow !== false && props.showArrow !== "false" && props.showArrow !== ""
);
const showIndicators = useComputed(
  () => props.showIndicator && props.indicatorPosition !== "none" && total.value > 1
);

const indicatorIndex = (event: Event): number => {
  const value = (event.currentTarget as HTMLElement | null)?.dataset.index;
  return value == null ? -1 : Number(value);
};

const onIndicatorClick = (event: Event): void => {
  if (props.trigger === "click") goTo(indicatorIndex(event));
};

const onIndicatorEnter = (event: Event): void => {
  if (props.trigger === "hover") goTo(indicatorIndex(event));
};

const onKeydown = (event: KeyboardEvent): void => {
  const previousKey = props.direction === "vertical" ? "ArrowUp" : "ArrowLeft";
  const nextKey = props.direction === "vertical" ? "ArrowDown" : "ArrowRight";
  if (event.key === previousKey) {
    event.preventDefault();
    doPrev();
  } else if (event.key === nextKey) {
    event.preventDefault();
    doNext();
  } else if (event.key === "Home") {
    event.preventDefault();
    goTo(0);
  } else if (event.key === "End") {
    event.preventDefault();
    goTo(total.value - 1);
  }
};

onMount(updateTotal);
onBeforeUnmount(clearTimer);
watchEffect(() => {
  void active.value;
  void total.value;
  void props.type;
  applyFade();
  syncSlides();
  applyCard();
});

defineExpose({
  get activeIndex() {
    return active.peek();
  },
  setActiveItem,
  prev: doPrev,
  next: doNext
});

defineStyle(styles);

const Carousel = defineHtml(html`
  <div
    class="carousel"
    :style=${{ height: props.height, borderRadius: props.radius, "--_dur": props.duration }}
    role="region"
    aria-roledescription="carousel"
    :aria-label=${props.ariaLabel}
    tabindex="0"
    @mouseenter=${onEnter}
    @mouseleave=${onLeave}
    @keydown=${onKeydown}
  >
    <div class="track" :style=${props.effect !== "fade" ? { transform: trackTransform() } : {}}>
      <slot @slotchange=${updateTotal}></slot>
    </div>

    <div class="arrows" v-if=${showArrows}>
      <button class="arrow arrow-left" type="button" aria-label="上一张" @click=${doPrev}><span aria-hidden="true"></span></button>
      <button class="arrow arrow-right" type="button" aria-label="下一张" @click=${doNext}><span aria-hidden="true"></span></button>
    </div>

    <div class="indicators" v-if=${showIndicators} role="tablist" aria-label="轮播页选择">
      <button
        v-for="(dot, idx) in dots"
        :key="idx"
        class="dot"
        :class="{ 'is-active': idx === active }"
        :data-index="idx"
        :aria-label="'切换到第 ' + (idx + 1) + ' 张'"
        :aria-current="idx === active ? 'true' : undefined"
        type="button"
        @click=${onIndicatorClick}
        @mouseenter=${onIndicatorEnter}
      >
        <span v-if=${props.indicatorType === "number"}>{{ idx + 1 }}</span>
      </button>
    </div>
  </div>
`);

export { Carousel };
