import { defineHtml, html } from "elfui";

const formRows = [
  { name: "model", type: "object", desc: "useReactive 对象" },
  { name: "rules", type: "FormRules", desc: "字段→规则数组" },
  { name: "size", type: "sm|md|lg", default: "md" },
  { name: "disabled", type: "boolean", default: "false" },
  { name: "label-position", type: "top|left|right", default: "right" },
  { name: "label-width", type: "string", default: "100px" },
  { name: "label-suffix", type: "string", default: "''" },
  { name: "inline", type: "boolean", default: "false" },
  { name: "hide-required-asterisk", type: "boolean" },
  { name: "require-asterisk-position", type: "left|right", default: "left" },
  { name: "show-message / inline-message / status-icon", type: "boolean", default: "true / false / false" },
  { name: "validate-on-rule-change", type: "boolean", default: "true" },
  { name: "scroll-to-error", type: "boolean", default: "false" },
  { name: "scroll-into-view-options", type: "ScrollIntoViewOptions | false", default: "smooth / center" },
  { name: "prevent-submit", type: "boolean", default: "true" }
];

const formItemRows = [
  { name: "prop", type: "string", desc: "字段路径，支持 a.b" },
  { name: "label", type: "string" },
  { name: "rules", type: "FormRule[]", desc: "与 form.rules[prop] 合并" },
  { name: "required", type: "boolean" },
  { name: "size", type: "sm|md|lg" },
  { name: "error", type: "string", desc: "手动设置错误信息" },
  { name: "inline-message", type: "boolean" },
  { name: "show-message", type: "boolean", default: "true" }
];

const ruleRows = [
  { name: "required", type: "boolean", desc: "必填" },
  { name: "type", type: "string|number|integer|float|email|url|date" },
  { name: "enum", type: "any[]", desc: "值必须在列表中" },
  { name: "fields", type: "string", desc: "跨字段联动" },
  { name: "min / max", type: "number" },
  { name: "pattern", type: "RegExp" },
  { name: "validator", type: "(v, model) => string|true|Promise", desc: "自定义，支持异步" },
  { name: "trigger", type: "blur|change|input" },
  { name: "message", type: "string", desc: "自定义错误信息" }
];

const PageFormProps = defineHtml(html`
  <h2>elf-form Props</h2>
  <elf-props-table title="elf-form Props" :rows="formRows" />
  <h2>elf-form-item Props</h2>
  <elf-props-table title="elf-form-item Props" :rows="formItemRows" />
  <h2>FormRule 字段</h2>
  <elf-props-table title="FormRule 字段" :rows="ruleRows" />
`);

export { PageFormProps };
