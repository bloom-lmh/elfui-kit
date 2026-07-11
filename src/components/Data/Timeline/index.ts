// elf-timeline — Material Design 时间轴

import { defineProps, defineStyle, html, useComputed, defineHtml } from "elfui";

import styles from "./style.scss?inline";
import type { TimelineItem, TimelineProps } from "./types";

export type { TimelineItem, TimelineMode, TimelineProps } from "./types";

const props = defineProps({
  items: { type: Array, default: () => [] },
  mode: { type: String, default: "left" },
  reverse: { type: Boolean, default: false }
}) as unknown as Readonly<TimelineProps>;

type TimelineRenderItem = TimelineItem & {
  __key: string;
  __idx: number;
  __last: boolean;
  __side: string;
};

const list = useComputed(() => {
  const arr = props.items || [];
  const result = props.reverse ? [...arr].reverse() : arr;
  const len = result.length;
  const isAlt = props.mode === "alternate" || props.mode === "horizontal";
  return result.map(
    (item: TimelineItem, i: number): TimelineRenderItem => ({
      ...item,
      __key: String(item.timestamp || item.title || i),
      __idx: i,
      __last: i === len - 1,
      __side: isAlt ? (i % 2 === 0 ? "left" : "right") : "left"
    })
  );
});

const nodeClass = (item: Record<string, unknown>): Record<string, boolean> => {
  const color = String(item.color || "primary");
  return { [`is-${color}`]: true };
};

defineStyle(styles);

const Timeline = defineHtml(html`
  <div class="timeline">
    <div
      v-for="item in list"
      :key="item.__key"
      class="item"
      :class="{
        'is-right': item.__side === 'right',
        'is-last': item.__last,
        'is-both': item.side === 'both'
      }"
    >
      <div class="line"></div>
      <div
        class="body body-left"
        :part="'body-' + item.__idx"
        v-if="item.__side === 'right' || item.side === 'both' || item.side === 'left'"
      >
        <div class="timestamp" v-if="item.timestamp2 || item.timestamp">
          {{ item.timestamp2 || item.timestamp }}
        </div>
        <div class="title" v-if="item.title2 || item.title">{{ item.title2 || item.title }}</div>
        <span v-if="item.content2 || item.content" v-html="item.content2 || item.content"></span>
        <slot></slot>
      </div>

      <div class="node" :class="nodeClass(item)" :part="'node-' + item.__idx">
        <span class="node-inner">{{ item.icon || "" }}</span>
      </div>

      <div
        class="body body-right"
        :part="'body-' + item.__idx"
        v-if="item.__side === 'left' || item.side === 'both' || item.side === 'right'"
      >
        <div class="timestamp" v-if="item.timestamp">{{ item.timestamp }}</div>
        <div class="title" v-if="item.title">{{ item.title }}</div>
        <span v-if="item.content" v-html="item.content"></span>
        <slot></slot>
      </div>
    </div>
  </div>
`);

export { Timeline };
