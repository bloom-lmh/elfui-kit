import { defineHtml, defineStyle, html, useRef } from "elfui";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const activeLong = useRef("five");
const activeFixed = useRef("alpha");
const activeGrow = useRef("starter");
const t = createDocsTranslator({
  heading: { zh: "标签变体", en: "Tab variants" },
  centered: { zh: "激活项居中与翻页按钮", en: "Centered active tab and pagination controls" },
  fixed: { zh: "固定标签宽度", en: "Fixed tab widths" },
  grow: { zh: "扩展卡片标签", en: "Grow card tabs" },
  option: { zh: "选项", en: "Option" },
  starter: { zh: "开胃菜", en: "Starters" },
  main: { zh: "主菜", en: "Mains" },
  dessert: { zh: "甜点", en: "Desserts" },
  drink: { zh: "饮品", en: "Drinks" },
  starterContent: { zh: "轻食、沙拉与当季前菜。", en: "Light dishes, salads, and seasonal starters." },
  mainContent: { zh: "本季主菜和厨师推荐。", en: "Seasonal mains and chef recommendations." },
  dessertContent: { zh: "甜点、咖啡与茶饮。", en: "Desserts, coffee, and tea." },
  drinkContent: { zh: "无酒精饮品和特调。", en: "Alcohol-free drinks and signatures." }
});

const longItems = () => Array.from({ length: 9 }, (_, index) => ({
  label: `${t("option")} ${index + 1}`,
  value: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][index]
}));
const fixedItems = () => [
  { label: `${t("option")} 1`, value: "alpha" },
  { label: `${t("option")} 2`, value: "beta" }
];
const growItems = () => [
  { label: t("starter"), value: "starter", content: t("starterContent") },
  { label: t("main"), value: "main", content: t("mainContent") },
  { label: t("dessert"), value: "dessert", content: t("dessertContent") },
  { label: t("drink"), value: "drink", content: t("drinkContent") }
];
const updateLong = (event: CustomEvent): void => activeLong.set(String(event.detail || ""));
const updateFixed = (event: CustomEvent): void => activeFixed.set(String(event.detail || ""));
const updateGrow = (event: CustomEvent): void => activeGrow.set(String(event.detail || ""));

const codeLong = `<elf-tabs center-active show-arrows :items.prop=\${items} :modelValue.prop=\${active.value} />`;
const codeFixed = `<elf-tabs fixed-tabs :items.prop=\${items} :modelValue.prop=\${active.value} />`;
const codeGrow = `<elf-tabs grow type="card" show-panels :items.prop=\${items} :modelValue.prop=\${active.value} />`;
const script = `const active = useRef("");
const onUpdate = (event) => active.set(event.detail);`;

defineStyle(styles);

const PageTabsEx10 = defineHtml(html`
  <h2>{{ t("heading") }}</h2>
  <elf-playground :title=${t("centered")} :code=${codeLong} :script=${script}>
    <div class="tabs-variant-demo">
      <elf-tabs :key=${t("centerTitle")} center-active show-arrows :items.prop=${longItems()} :modelValue.prop=${activeLong.value} @update:modelValue=${updateLong}></elf-tabs>
    </div>
  </elf-playground>
  <elf-playground :title=${t("fixed")} :code=${codeFixed} :script=${script}>
    <div class="tabs-variant-demo">
      <elf-tabs :key=${t("fixedTitle")} fixed-tabs :items.prop=${fixedItems()} :modelValue.prop=${activeFixed.value} @update:modelValue=${updateFixed}></elf-tabs>
    </div>
  </elf-playground>
  <elf-playground :title=${t("grow")} :code=${codeGrow} :script=${script}>
    <div class="tabs-variant-demo">
      <elf-tabs :key=${t("growTitle")} grow type="card" show-panels :items.prop=${growItems()} :modelValue.prop=${activeGrow.value} @update:modelValue=${updateGrow}></elf-tabs>
    </div>
  </elf-playground>
`);

export { PageTabsEx10 };
