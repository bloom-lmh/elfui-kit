import { defineHtml, html, useRef } from "@elfui/core";

const slottedActive = useRef(["guide"]);

const slotCode = `<elf-collapse :modelValue.prop="slottedActive" @update:modelValue="onSlottedUpdate">
  <elf-collapse-item name="guide" title="组合式用法">
    默认 slot 承载面板内容。
  </elf-collapse-item>
  <elf-collapse-item name="custom">
    <span slot="title">自定义标题</span>
    <span slot="icon">+</span>
    title 与 icon 都可通过 slot 替换。
  </elf-collapse-item>
</elf-collapse>`;

const slotScript = `const slottedActive = useRef(["guide"]);`;

const onSlottedUpdate = (event: CustomEvent): void => {
  slottedActive.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
};

const PageCollapseEx3 = defineHtml(html`
<elf-playground title="组合式折叠面板" :code=${slotCode} :script=${slotScript}>
      <elf-collapse :modelValue.prop=${slottedActive} @update:modelValue=${onSlottedUpdate}>
        <elf-collapse-item name="guide" title="组合式用法">默认 slot 承载面板内容。</elf-collapse-item>
        <elf-collapse-item name="custom">
          <span slot="title">自定义标题</span>
          <span slot="icon">+</span>
          title 与 icon 都可通过 slot 替换。
        </elf-collapse-item>
      </elf-collapse>
    </elf-playground>
`);

export { PageCollapseEx3 };
