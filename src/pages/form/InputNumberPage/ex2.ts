import { defineHtml, html, useRef } from "elfui";

const price = useRef(12.5);

const code2 = `<elf-input-number
  :modelValue=\${price}
  :step=\${0.5}
  :precision=\${2}
  step-strictly
  controls-position="right"
  @update:modelValue=\${onPriceUpdate}
/>
<span slot="status" class="demo-state">价格：{{ price }}</span>`;

const script2 = `const price = useRef(12.5);

const onPriceUpdate = (event) => {
  price.set(event.detail ?? 0);
};`;

const onPriceUpdate = (event: CustomEvent): void => {
  price.set(Number(event.detail ?? 0));
};

const PageInputNumberEx2 = defineHtml(html`
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
      <span slot="status" class="demo-state">价格：{{ price }}</span>
    </elf-playground>
`);

export { PageInputNumberEx2 };
