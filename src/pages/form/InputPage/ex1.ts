import { defineHtml, defineStyle, html, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const value = useRef("Hover to Clear me");
const variant = useRef("outlined");
const flags = useRef<string[]>(["clearable"]);

const t = createDocsTranslator({
  appearance: { zh: "外观与状态", en: "Appearance and states" },
  playground: { zh: "Material 输入框操作台", en: "Material text field playground" },
  controls: { zh: "输入框配置", en: "Text field controls" },
  variant: { zh: "外观", en: "Variant" },
  outlined: { zh: "描边", en: "Outlined" },
  filled: { zh: "填充", en: "Filled" },
  underlined: { zh: "下划线", en: "Underlined" },
  solo: { zh: "独立表面", en: "Solo" },
  soloFilled: { zh: "独立填充", en: "Solo filled" },
  soloInverted: { zh: "独立反色", en: "Solo inverted" },
  clearable: { zh: "允许清空", en: "Clearable" },
  disabled: { zh: "禁用", en: "Disabled" },
  label: { zh: "标签", en: "Label" },
  current: { zh: "当前值", en: "Value" },
  icons: { zh: "内外前后图标", en: "Inner and outer icons" },
  iconTitle: { zh: "四种图标位置独立展示", en: "Four icon positions" },
  prepend: { zh: "外部前置", en: "Prepend" },
  prependInner: { zh: "内部前置", en: "Prepend inner" },
  appendInner: { zh: "内部后置", en: "Append inner" },
  append: { zh: "外部后置", en: "Append" }
});

const variantOptions = () => [
  { label: t("outlined"), value: "outlined" },
  { label: t("filled"), value: "filled" },
  { label: t("underlined"), value: "underlined" },
  { label: t("solo"), value: "solo" },
  { label: t("soloFilled"), value: "solo-filled" },
  { label: t("soloInverted"), value: "solo-inverted" }
];

const flagOptions = () => [
  { label: t("clearable"), value: "clearable" },
  { label: t("disabled"), value: "disabled" }
];

const detail = (event: CustomEvent): unknown => Array.isArray(event.detail) ? event.detail[0] : event.detail;
const onVariant = (event: CustomEvent): void => variant.set(String(detail(event) || "outlined"));
const onValue = (event: CustomEvent): void => value.set(String(event.detail || ""));
const onFlags = (event: CustomEvent): void => flags.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
const hasFlag = (name: string): boolean => flags.value.includes(name);

const code = (): string => `<elf-input
  variant="${variant.value}"
  label="${t("label")}"
  model-value="${value.value}"
  ${hasFlag("clearable") ? "clearable" : ""}
>
  <svg slot="prefix">...</svg>
</elf-input>`;

const script = `const value = useRef("Hover to Clear me");
const variant = useRef("outlined");
const onValue = (event) => value.set(event.detail);`;

const iconCode = `<elf-input variant="outlined" label="Prepend"><svg slot="prepend">...</svg></elf-input>
<elf-input variant="outlined" label="Prepend inner"><svg slot="prefix">...</svg></elf-input>
<elf-input variant="outlined" label="Append inner"><svg slot="suffix">...</svg></elf-input>
<elf-input variant="outlined" label="Append"><svg slot="append">...</svg></elf-input>`;

defineStyle(styles);

const PageInputEx1 = defineHtml(html`
  <h2>${t("appearance")}</h2>
  <elf-playground :title=${t("playground")} :code=${code()} :script=${script}>
    <span slot="status" class="demo-state">${t("current")}：${value.value || "—"}</span>
    <section class="input-lab-preview">
      <elf-input
        :variant.prop=${variant.value}
        :label=${t("label")}
        :modelValue.prop=${value.value}
        :clearable.prop=${hasFlag("clearable")}
        :disabled.prop=${hasFlag("disabled")}
        @update:modelValue=${onValue}
      >
        <svg slot="prefix" viewBox="0 0 24 24" aria-label="search"><circle cx="11" cy="11" r="6"></circle><path d="m16 16 4 4"></path></svg>
      </elf-input>
    </section>
    <aside slot="controls" class="input-lab-config" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label><span>${t("variant")}</span><elf-select :options.prop=${variantOptions()} :modelValue.prop=${variant.value} @update:modelValue=${onVariant}></elf-select></label>
      <elf-checkbox-group :options.prop=${flagOptions()} :modelValue.prop=${flags.value} @update:modelValue=${onFlags}></elf-checkbox-group>
    </aside>
  </elf-playground>

  <h2>${t("icons")}</h2>
  <elf-playground :title=${t("iconTitle")} :code=${iconCode}>
    <div class="input-icon-grid">
      <elf-input variant="outlined" :label=${t("prepend")}><svg slot="prepend" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"></circle><path d="m16 16 4 4"></path></svg></elf-input>
      <elf-input variant="outlined" :label=${t("prependInner")}><svg slot="prefix" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle><path d="M8 12h8"></path></svg></elf-input>
      <elf-input variant="outlined" :label=${t("appendInner")}><svg slot="suffix" viewBox="0 0 24 24"><path d="m7 12 3 3 7-7"></path></svg></elf-input>
      <elf-input variant="outlined" :label=${t("append")}><svg slot="append" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></elf-input>
    </div>
  </elf-playground>
`);

export { PageInputEx1 };
