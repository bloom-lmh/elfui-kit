import { defineHtml, defineProps, defineStyle, html } from "@elfui/core";
import "../list-content";
import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
import type { ListItemRenderer, ListProps } from "./types";

export type { ListItemKey, ListItemRenderer, ListProps } from "./types";

const props = defineProps<ListProps>({
  items: { type: Array, default: () => [] },
  itemKey: { type: [String, Function], default: "id" },
  renderItem: { type: Function },
  bordered: { type: Boolean, default: false },
  divided: { type: Boolean, default: true },
  emptyText: { type: String, default: "" }
});

const locale = useLocaleProvider();

const items = (): unknown[] => Array.isArray(props.items) ? props.items : [];
const keyOf = (item: unknown, index: number): string => {
  if (typeof props.itemKey === "function") return String(props.itemKey(item, index));
  if (item && typeof item === "object") return String((item as Record<string, unknown>)[String(props.itemKey)] ?? index);
  return String(index);
};
const render = (item: unknown, index: number): unknown => {
  if (typeof props.renderItem === "function") return (props.renderItem as ListItemRenderer)(item, index);
  return item && typeof item === "object" ? JSON.stringify(item) : String(item ?? "");
};

defineStyle(styles);

const List = defineHtml<ListProps>(html`
  <ul class="list" :class=${{ "is-bordered": props.bordered, "is-divided": props.divided }} role="list">
    <template v-if=${items().length > 0}>
      <li v-for="(item, index) in items()" :key=${keyOf(item, index)} class="item" part="item" v-elf-list-content=${render(item, index)}></li>
    </template>
    <slot v-else><li class="empty">${props.emptyText || locale.t("table.empty")}</li></slot>
  </ul>
`);

export { List };
