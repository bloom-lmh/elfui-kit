import { defineHtml, defineProps, defineStyle, html, useHostFlag } from "elfui";

import styles from "./style.scss?inline";
import type { CarouselItemProps } from "../Carousel/types";

export type { CarouselItemProps } from "../Carousel/types";

const props = defineProps<CarouselItemProps>({
  name: { type: [String, Number], default: "" },
  label: { type: String, default: "" },
  ariaLabel: { type: String, default: "" },
  active: { type: Boolean, default: false },
  index: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
});

useHostFlag("active", () => Boolean(props.active));

defineStyle(styles);

const CarouselItem = defineHtml(html`
  <div
    class="carousel-item"
    role="group"
    aria-roledescription="slide"
    :aria-label=${props.ariaLabel || (props.label || "Slide") + " " + (props.index + 1) + " of " + props.total}
    :aria-hidden=${props.active ? "false" : "true"}
  >
    <slot></slot>
    <span v-if=${props.label} class="carousel-item__label">${props.label}</span>
  </div>
`);

export { CarouselItem };
