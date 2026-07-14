import { defineHtml, html, useRef } from "elfui";

const clearValue = useRef("");
const readonlyText = useRef("只读内容");

const code1 = `<elf-input size="small" placeholder="small" />
<elf-input size="default" placeholder="default" />
<elf-input size="large" placeholder="large" />`;

const code2 = `<elf-input disabled placeholder="禁用" />
<elf-input readonly :modelValue=\${readonlyText} />`;

const script2 = `const readonlyText = useRef("只读内容");`;

const code3 = `<div style="width:240px">
  <elf-input
    :modelValue=\${clearValue}
    clearable
    clear-icon="clear"
    placeholder="输入后出现清空按钮"
    @update:modelValue=\${onClearUpdate}
  />
</div>
<span slot="status" class="demo-state">当前：{{ clearValue || '空' }}</span>`;

const script3 = `const clearValue = useRef("");

const onClearUpdate = (event) => {
  clearValue.set(event.detail);
};`;

const onClearUpdate = (event: CustomEvent): void => {
  clearValue.set(String(event.detail || ""));
};

const PageInputEx2 = defineHtml(html`
  <h2>尺寸</h2>
  <elf-playground title="small / default / large" :code=${code1}>
    <div style="width:200px;margin-bottom:8px">
      <elf-input size="small" placeholder="small"></elf-input>
    </div>
    <div style="width:200px;margin-bottom:8px">
      <elf-input size="default" placeholder="default"></elf-input>
    </div>
    <div style="width:200px"><elf-input size="large" placeholder="large"></elf-input></div>
  </elf-playground>

  <h2>状态</h2>
  <elf-playground title="disabled / readonly" :code=${code2} :script=${script2}>
    <div style="width:200px;margin-bottom:8px">
      <elf-input disabled placeholder="禁用"></elf-input>
    </div>
    <div style="width:200px"><elf-input readonly :modelValue=${readonlyText}></elf-input></div>
  </elf-playground>

  <h2>可清空</h2>
  <elf-playground title="clearable / clear-icon" :code=${code3} :script=${script3}>
    <div style="width:240px">
      <elf-input
        :modelValue=${clearValue}
        clearable
        clear-icon="clear"
        placeholder="输入后出现清空按钮"
        @update:modelValue=${onClearUpdate}
      ></elf-input>
    </div>
    <span slot="status" class="demo-state">当前：{{ clearValue || '空' }}</span>
  </elf-playground>
`);

export { PageInputEx2 };
