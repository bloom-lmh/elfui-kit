import { defineHtml, html, useRef } from "elfui";

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

const code3 = `<elf-input-number disabled :modelValue=\${3} />
<elf-input-number readonly :modelValue=\${6} />
<elf-input-number :controls=\${false} placeholder="无控制按钮" />`;

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
      title="precision / step-strictly / controls-position"
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

    <elf-playground title="disabled / readonly / controls=false" :code=${code3}>
      <elf-input-number disabled :modelValue=${3}></elf-input-number>
      <elf-input-number readonly :modelValue=${6}></elf-input-number>
      <elf-input-number :controls=${false} placeholder="无控制按钮"></elf-input-number>
    </elf-playground>
  </elf-container>
`);

export { PageInputNumber };
