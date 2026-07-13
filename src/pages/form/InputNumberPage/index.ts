import { defineHtml, html, useComponents, useRef } from "elfui";
import { PageInputNumberProps } from "./props";

useComponents({ "page-input-number-props": PageInputNumberProps });

const count = useRef(2);
const price = useRef(12.5);

const code1 = `<elf-input-number
  :modelValue=\${count}
  min="0"
  max="10"
  :step=\${1}
  placeholder="数量"
  @update:modelValue=\${onCountUpdate}
/>
<span class="demo-state">数量：{{ count }}</span>`;

const script1 = `const count = useRef(2);

const onCountUpdate = (event) => {
  count.set(event.detail ?? 0);
};`;

const code2 = `<elf-input-number
  :modelValue=\${price}
  :step=\${0.5}
  :precision=\${2}
  step-strictly
  controls-position="right"
  @update:modelValue=\${onPriceUpdate}
/>
<span class="demo-state">价格：{{ price }}</span>`;

const script2 = `const price = useRef(12.5);

const onPriceUpdate = (event) => {
  price.set(event.detail ?? 0);
};`;

const code3 = `<label>禁用状态 <elf-input-number disabled :modelValue.prop=\${3} /></label>
<label>只读状态 <elf-input-number readonly :modelValue.prop=\${6} /></label>
<label>隐藏控制按钮 <elf-input-number :controls.prop=\${false} :modelValue.prop=\${8} /></label>`;

const onCountUpdate = (event: CustomEvent): void => {
  count.set(Number(event.detail ?? 0));
};

const onPriceUpdate = (event: CustomEvent): void => {
  price.set(Number(event.detail ?? 0));
};

const PageInputNumber = defineHtml(html`
  <elf-container>
    <h1>InputNumber 数字输入框</h1>
    <p>用于数值输入，支持最大最小值、步进、精度、严格步进和控制按钮位置。</p>

    <elf-playground title="基础受控" :code=${code1} :script=${script1}>
      <elf-input-number
        :modelValue=${count}
        min="0"
        max="10"
        :step=${1}
        placeholder="数量"
        @update:modelValue=${onCountUpdate}
      ></elf-input-number>
      <span class="demo-state">数量：{{ count }}</span>
    </elf-playground>

    <elf-playground
      title="精度、严格步进与按钮位置"
      :code=${code2}
      :script=${script2}
    >
      <elf-input-number
        :modelValue=${price}
        :step=${0.5}
        :precision=${2}
        step-strictly
        controls-position="right"
        @update:modelValue=${onPriceUpdate}
      ></elf-input-number>
      <span class="demo-state">价格：{{ price }}</span>
    </elf-playground>

    <elf-playground title="禁用、只读与隐藏控制按钮" :code=${code3}>
      <div style="display:grid;gap:12px">
        <label style="display:flex;align-items:center;gap:12px">禁用状态 <elf-input-number disabled :modelValue.prop=${3}></elf-input-number></label>
        <label style="display:flex;align-items:center;gap:12px">只读状态 <elf-input-number readonly :modelValue.prop=${6}></elf-input-number></label>
        <label style="display:flex;align-items:center;gap:12px">隐藏控制按钮 <elf-input-number :controls.prop=${false} :modelValue.prop=${8}></elf-input-number></label>
      </div>
    </elf-playground>
    <page-input-number-props></page-input-number-props>
  </elf-container>
`);

export { PageInputNumber };
