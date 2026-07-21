import { defineHtml, html, useRef } from "@elfui/core";

const time = useRef("09:30");

const updateTime = (event: CustomEvent): void => {
  time.set(String(event.detail));
};

const singleCode = `<elf-time-picker
  :modelValue.prop="time"
  :step="300"
  clearable
  @update:modelValue="updateTime"
/>`;

const singleScript = `const time = useRef("09:30");

const updateTime = (event) => {
  time.set(event.detail);
};`;

const PageTimePickerEx1 = defineHtml(html`
<elf-playground title="单时间" :code=${singleCode} :script=${singleScript}>
      <div style="display:grid;gap:16px;width:100%;max-width:820px">
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <elf-time-picker
            :modelValue.prop="time"
            label="开始时间"
            :step=${300}
            clearable
            @update:modelValue=${updateTime}
          ></elf-time-picker>
          <span slot="status" class="demo-state">{{ time }}</span>
        </div>
      </div>
    </elf-playground>
`);

export { PageTimePickerEx1 };
