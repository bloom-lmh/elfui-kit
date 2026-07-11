import { defineHtml, html, useRef } from "elfui";

const enabled = useRef(false);
const textValue = useRef(true);

const updateEnabled = (event: Event): void => {
  enabled.set(Boolean((event as CustomEvent).detail));
};

const updateText = (event: Event): void => {
  textValue.set(Boolean((event as CustomEvent).detail));
};

const code1 = `<elf-switch v-model="enabled" label="接收系统通知" />`;
const code2 = `<elf-switch active-text="开" inactive-text="关" />`;

const PageSwitchEx1 = defineHtml(html`
  <h2>基础</h2>
  <elf-playground title="受控状态" :code="code1">
    <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      <elf-switch
        :modelValue="enabled"
        label="接收系统通知"
        @update:modelValue="updateEnabled"
      ></elf-switch>
      <span class="demo-state">{{ enabled ? "已开启" : "已关闭" }}</span>
    </div>
  </elf-playground>

  <h2>状态文字</h2>
  <elf-playground title="active / inactive text" :code="code2">
    <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      <elf-switch
        :modelValue="textValue"
        active-text="开"
        inactive-text="关"
        @update:modelValue="updateText"
      ></elf-switch>
      <elf-switch active-text="ON" inactive-text="OFF"></elf-switch>
    </div>
  </elf-playground>
`);

export { PageSwitchEx1 };
