import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "effect", type: "slide | fade", default: "slide", desc: "Transition effect" },
  { name: "type", type: "'' | card", default: "''", desc: "Card layout; requires direct elf-carousel-item children" },
  { name: "autoplay", type: "boolean", default: "true", desc: "Automatically advance slides" },
  { name: "interval", type: "number", default: "4000", desc: "Autoplay interval in ms" },
  { name: "loop", type: "boolean", default: "true", desc: "Wrap at each end" },
  { name: "show-arrow", type: "circle | square | ghost | false", default: "circle", desc: "Arrow visual style" },
  { name: "arrow", type: "always | hover | never", default: "hover", desc: "Arrow visibility" },
  { name: "show-indicator", type: "boolean", default: "true", desc: "Show the indicator controls" },
  { name: "indicator-type", type: "dot | line | number", default: "dot", desc: "Indicator visual style" },
  { name: "indicator-position", type: "'' | outside | none", default: "''", desc: "Indicator placement" },
  { name: "trigger", type: "hover | click", default: "hover", desc: "Indicator activation" },
  { name: "initial-index", type: "number", default: "0", desc: "Initial zero-based slide" },
  { name: "direction", type: "horizontal | vertical", default: "horizontal", desc: "Slide axis" },
  { name: "height", type: "string", default: "'320px'", desc: "Carousel height" },
  { name: "duration", type: "string", default: "'0.5s'", desc: "Transition duration" },
  { name: "pause-on-hover", type: "boolean", default: "true", desc: "Pause autoplay on hover" },
  { name: "radius", type: "string", default: "'12px'", desc: "Corner radius" },
  { name: "aria-label", type: "string", default: "'Carousel'", desc: "Accessible region label" }
];

const eventsRows = [
  { name: "change", type: "(current: number, previous: number) => void", desc: "Emitted after a real slide change" }
];

const exposesRows = [
  { name: "activeIndex", type: "number", desc: "Current zero-based slide index" },
  { name: "setActiveItem", type: "(index | label) => void", desc: "Select a slide by index or child label" },
  { name: "prev / next", type: "() => void", desc: "Move to the previous or next slide" }
];

const itemRows = [
  { name: "name", type: "string | number", default: "''", desc: "Stable item identifier for setActiveItem" },
  { name: "label", type: "string", default: "''", desc: "Readable slide label and accessible metadata" },
  { name: "aria-label", type: "string", default: "''", desc: "Overrides the generated slide label" }
];

const PageCarouselProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" />
  <elf-props-table title="Events" :rows="eventsRows" />
  <elf-props-table title="Exposes" :rows="exposesRows" />
  <elf-props-table title="CarouselItem Props" :rows="itemRows" />
`);

export { PageCarouselProps };
