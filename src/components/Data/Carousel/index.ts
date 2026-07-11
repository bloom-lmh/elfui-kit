// elf-carousel — Material Design 轮播图

import {
  defineEmits,
  defineProps,
  defineStyle,
  html,
  onMount,
  useComputed,
  useHost,
  useRef,
  watchEffect,
  defineHtml
} from "elfui";

import styles from "./style.scss?inline";

export type { CarouselEffect, CarouselProps } from "./types";

const props = defineProps({
  effect: { type: String, default: "slide" },
  autoplay: { type: Boolean, default: true },
  interval: { type: Number, default: 4000 },
  loop: { type: Boolean, default: true },
  showArrow: { type: String, default: "circle" },
  showIndicator: { type: Boolean, default: true },
  indicatorType: { type: String, default: "dot" },
  height: { type: String, default: "320px" },
  duration: { type: String, default: "0.5s" },
  pauseOnHover: { type: Boolean, default: true },
  radius: { type: String, default: "12px" }
});

const emit = defineEmits(["change"]);

const host = useHost();

const active = useRef(0);

const total = useRef(0);

let timer: ReturnType<typeof setInterval> | null = null;

const clearTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const startTimer = () => {
  clearTimer();
  if (!props.autoplay) return;
  if (total.value <= 1) return;
  timer = setInterval(() => doNext(), Number(props.interval));
};

const doPrev = () => {
  const t = total.value;
  if (t <= 1) return;
  const a = active.value;
  if (a > 0) active.set(a - 1);
  else if (props.loop) active.set(t - 1);
  emit("change", active.value);
  startTimer();
};

const doNext = () => {
  const t = total.value;
  if (t <= 1) return;
  const a = active.value;
  if (a < t - 1) active.set(a + 1);
  else if (props.loop) active.set(0);
  else {
    clearTimer();
    return;
  }
  emit("change", active.value);
  startTimer();
};

const goTo = (idx: number) => {
  if (idx < 0 || idx >= total.value) return;
  active.set(idx);
  emit("change", idx);
  startTimer();
};

const onEnter = () => {
  if (props.pauseOnHover) clearTimer();
};

const onLeave = () => {
  if (props.pauseOnHover) startTimer();
};

const updateTotal = () => {
  const n = host.children.length;
  total.set(n);
  startTimer();
};

const onSlotChange = () => updateTotal();

onMount(() => updateTotal());

const applyFade = () => {
  if (props.effect !== "fade") return;
  const children = Array.from(host.children) as HTMLElement[];
  const a = active.value;
  children.forEach((c, i) => {
    c.style.opacity = i === a ? "1" : "0";
    c.style.pointerEvents = i === a ? "auto" : "none";
  });
};

watchEffect(() => {
  void active.value;
  void total.value;
  applyFade();
});

const trackTransform = () => `translateX(-${active.value * 100}%)`;

const dots = useComputed(() => Array.from({ length: total.value }, (_, i) => i));

const showArrows = useComputed(() => props.showArrow !== "false" && props.showArrow !== "");

defineStyle(styles);

const Carousel = defineHtml(html`
  <div
    class="carousel"
    :style=${{ height: props.height, borderRadius: props.radius, "--_dur": props.duration }}
    @mouseenter=${onEnter()}
    @mouseleave=${onLeave()}
  >
    <div class="track" :style=${props.effect !== "fade" ? { transform: trackTransform() } : {}}>
      <slot @slotchange=${onSlotChange()}></slot>
    </div>

    <div class="arrows" v-if=${showArrows}>
      <button class="arrow arrow-left" @click=${doPrev()}>‹</button>
      <button class="arrow arrow-right" @click=${doNext()}>›</button>
    </div>

    <div class="indicators" v-if=${props.showIndicator && total > 1}>
      <button
        v-for="(dot, idx) in dots"
        :key="idx"
        class="dot"
        :class="{ 'is-active': idx === active }"
        @click.stop="goTo(idx)"
      >
        <span v-if=${props.indicatorType === "number"}>{{ idx + 1 }}</span>
      </button>
    </div>
  </div>
`);

export { Carousel };
