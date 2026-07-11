import { defineHtml, html, useRef } from "elfui";

const size = useRef(36);
const verticalSize = useRef(48);

const code1 = `<elf-splitter
  :modelValue=\${size}
  :min=\${20}
  :max=\${70}
  @update:modelValue=\${onSizeUpdate}
>
  <div slot="first">列表面板</div>
  <div slot="second">详情面板</div>
</elf-splitter>`;

const script1 = `const size = useRef(36);

const onSizeUpdate = (event) => {
  size.set(event.detail);
};`;

const code2 = `<elf-splitter
  vertical
  :modelValue=\${verticalSize}
  @update:modelValue=\${onVerticalUpdate}
>
  <div slot="first">上方面板</div>
  <div slot="second">下方面板</div>
</elf-splitter>`;

const script2 = `const verticalSize = useRef(48);`;

const code3 = `<elf-splitter disabled :modelValue=\${40}>
  <div slot="first">禁用拖拽</div>
  <div slot="second">固定区域</div>
</elf-splitter>`;

const onSizeUpdate = (event: CustomEvent): void => {
  size.set(Number(event.detail) || 36);
};

const onVerticalUpdate = (event: CustomEvent): void => {
  verticalSize.set(Number(event.detail) || 48);
};

const PageSplitter = defineHtml(html`
  <elf-container>
    <h1>Splitter 分割面板</h1>
    <p>通过拖拽分隔条调整两个区域比例，支持水平、垂直、范围限制和禁用。</p>

    <elf-playground title="水平分割 / 受控比例" :code=${code1} :script=${script1}>
      <elf-splitter :modelValue=${size} :min=${20} :max=${70} @update:modelValue=${onSizeUpdate}>
        <div slot="first" style="padding:16px">列表面板 ${Math.round(size.value)}%</div>
        <div slot="second" style="padding:16px">详情面板</div>
      </elf-splitter>
    </elf-playground>

    <elf-playground title="vertical" :code=${code2} :script=${script2}>
      <div style="height:260px">
        <elf-splitter vertical :modelValue=${verticalSize} @update:modelValue=${onVerticalUpdate}>
          <div slot="first" style="padding:16px">上方面板</div>
          <div slot="second" style="padding:16px">下方面板</div>
        </elf-splitter>
      </div>
    </elf-playground>

    <elf-playground title="disabled" :code=${code3}>
      <elf-splitter disabled :modelValue=${40}>
        <div slot="first" style="padding:16px">禁用拖拽</div>
        <div slot="second" style="padding:16px">固定区域</div>
      </elf-splitter>
    </elf-playground>
  </elf-container>
`);

export { PageSplitter };
