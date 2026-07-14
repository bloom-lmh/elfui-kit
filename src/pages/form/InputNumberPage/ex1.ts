import { defineHtml, html, useRef } from "elfui";

const count = useRef(2);

const code1 = `<elf-input-number
  :modelValue=\${count}
  min="0"
  max="10"
  :step=\${1}
  placeholder="数量"
  @update:modelValue=\${onCountUpdate}
/>
<span slot="status" class="demo-state">数量：{{ count }}</span>`;

const script1 = `const count = useRef(2);

const onCountUpdate = (event) => {
  count.set(event.detail ?? 0);
};`;

const onCountUpdate = (event: CustomEvent): void => {
  count.set(Number(event.detail ?? 0));
};

const PageInputNumberEx1 = defineHtml(html`
<elf-playground title="基础受控" :code=${code1} :script=${script1}>
      <elf-input-number
        :modelValue=${count}
        min="0"
        max="10"
        :step=${1}
        placeholder="数量"
        @update:modelValue=${onCountUpdate}
      ></elf-input-number>
      <span slot="status" class="demo-state">数量：{{ count }}</span>
    </elf-playground>
`);

export { PageInputNumberEx1 };
