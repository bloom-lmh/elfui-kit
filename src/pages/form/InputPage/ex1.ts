import { defineHtml, defineStyle, html, useRef } from "elfui";
import styles from "./demo.scss?inline";

const text = useRef("");
const password = useRef("");
const labVariant = useRef("outlined");
const labBackground = useRef("");
const labClearable = useRef(true);
const labDisabled = useRef(false);

const variantOptions = [
  { label: "默认", value: "default" },
  { label: "描边", value: "outlined" },
  { label: "下划线", value: "underlined" },
  { label: "独立表面", value: "solo" },
  { label: "独立填充", value: "solo-filled" },
  { label: "独立反色", value: "solo-inverted" }
];
const backgroundOptions = [
  { label: "跟随主题", value: "" },
  { label: "暖白", value: "#fff8e1" },
  { label: "浅蓝", value: "#e3f2fd" },
  { label: "浅绿", value: "#e8f5e9" }
];

const eventValue = <T>(event: CustomEvent, fallback: T): T => {
  const detail = event.detail;
  return (Array.isArray(detail) ? detail[0] : detail) ?? fallback;
};
const onLabVariant = (event: CustomEvent): void => labVariant.set(String(eventValue(event, labVariant.value)));
const onLabBackground = (event: CustomEvent): void => labBackground.set(String(eventValue(event, labBackground.value)));
const onLabClearable = (event: CustomEvent): void => labClearable.set(Boolean(eventValue(event, labClearable.value)));
const onLabDisabled = (event: CustomEvent): void => labDisabled.set(Boolean(eventValue(event, labDisabled.value)));
const labCode = (): string => `<elf-input
  variant="${labVariant.value}"
  label="项目名称"
  model-value="ElfUI"
  ${labBackground.value ? `background-color="${labBackground.value}"\n  ` : ""}${labClearable.value ? "clearable\n  " : ""}${labDisabled.value ? "disabled\n  " : ""}/>`;

const labScript = `const labVariant = useRef("outlined");
const labBackground = useRef("");
const labClearable = useRef(true);
const labDisabled = useRef(false);

const onVariant = (event) => labVariant.set(event.detail);
const onBackground = (event) => labBackground.set(event.detail);
const onClearable = (event) => labClearable.set(event.detail);
const onDisabled = (event) => labDisabled.set(event.detail);`;

const code1 = `<div style="width:280px">
  <elf-input
    :modelValue.prop=\${text.value}
    label="项目名称"
    placeholder="请输入"
    @update:modelValue=\${onTextUpdate}
  />
</div>
<span slot="status" class="demo-state">当前：{{ text || '未输入' }}</span>`;

const script1 = `const text = useRef("");

const onTextUpdate = (event) => {
  text.set(event.detail);
};`;

const code2 = `<div style="width:240px;margin-bottom:8px">
  <elf-input
    type="password"
    show-password
    :modelValue.prop=\${password.value}
    placeholder="密码"
    @update:modelValue=\${onPasswordUpdate}
  />
</div>
<div style="width:240px;margin-bottom:8px">
  <elf-input type="email" placeholder="邮箱" autocomplete="email" />
</div>
<div style="width:240px;margin-bottom:8px">
  <elf-input type="number" placeholder="数字" min="1" max="99" step="1" />
</div>
<div style="width:240px">
  <elf-input type="search" placeholder="搜索" />
</div>`;

const script2 = `const password = useRef("");

const onPasswordUpdate = (event) => {
  password.set(event.detail);
};`;

const onTextUpdate = (event: CustomEvent): void => {
  text.set(String(event.detail || ""));
};

const onPasswordUpdate = (event: CustomEvent): void => {
  password.set(String(event.detail || ""));
};

defineStyle(styles);

const PageInputEx1 = defineHtml(html`
  <h2>外观与状态</h2>
  <elf-playground title="输入框外观与状态" :code=${labCode()} :script=${labScript}>
    <span slot="status" class="demo-state">{{ labVariant }}</span>
    <section class="input-lab-preview">
      <elf-input
        :variant.prop=${labVariant.value}
        label="项目名称"
        model-value="ElfUI"
        :backgroundColor.prop=${labBackground.value}
        :clearable.prop=${labClearable.value}
        :disabled.prop=${labDisabled.value}
      ></elf-input>
    </section>
    <aside slot="controls" class="input-lab-config">
      <strong>配置</strong>
      <label><span>外观</span><elf-select :options.prop=${variantOptions} :modelValue.prop=${labVariant.value} variant="outlined" @update:modelValue=${onLabVariant}></elf-select></label>
      <label><span>背景</span><elf-select :options.prop=${backgroundOptions} :modelValue.prop=${labBackground.value} variant="outlined" @update:modelValue=${onLabBackground}></elf-select></label>
      <label class="input-lab-toggle"><span>允许清空</span><elf-switch :modelValue.prop=${labClearable.value} @update:modelValue=${onLabClearable}></elf-switch></label>
      <label class="input-lab-toggle"><span>禁用</span><elf-switch :modelValue.prop=${labDisabled.value} @update:modelValue=${onLabDisabled}></elf-switch></label>
    </aside>
  </elf-playground>

  <h2>基础</h2>
  <elf-playground title="text + v-model" :code=${code1} :script=${script1}>
    <div style="width:280px">
      <elf-input
        :modelValue.prop=${text.value}
        label="项目名称"
        placeholder="请输入"
        @update:modelValue=${onTextUpdate}
      ></elf-input>
    </div>
    <span slot="status" class="demo-state">当前：{{ text || '未输入' }}</span>
  </elf-playground>

  <h2>不同类型</h2>
  <elf-playground title="password / email / number / search" :code=${code2} :script=${script2}>
    <div style="width:240px;margin-bottom:8px">
      <elf-input
        type="password"
        show-password
        :modelValue.prop=${password.value}
        placeholder="密码"
        @update:modelValue=${onPasswordUpdate}
      ></elf-input>
    </div>
    <div style="width:240px;margin-bottom:8px">
      <elf-input type="email" placeholder="邮箱" autocomplete="email"></elf-input>
    </div>
    <div style="width:240px;margin-bottom:8px">
      <elf-input type="number" placeholder="数字" min="1" max="99" step="1"></elf-input>
    </div>
    <div style="width:240px"><elf-input type="search" placeholder="搜索"></elf-input></div>
  </elf-playground>
`);

export { PageInputEx1 };
