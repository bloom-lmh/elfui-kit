import { defineHtml, html, useRef } from "@elfui/core";

const fallbackTime = useRef("12:30");

const visibleLog = useRef("等待聚焦");

const updateFallback = (event: CustomEvent): void => {
  fallbackTime.set(String(event.detail || ""));
};

const clearFallback = (): string => "09:00";

const onVisibleChange = (event: CustomEvent): void => {
  visibleLog.set(event.detail ? "面板已打开" : "面板已关闭");
};

const controlCode = `<elf-time-picker
  :modelValue.prop="fallbackTime"
  min="09:00"
  max="18:00"
  size="lg"
  :editable="false"
  :valueOnClear.prop="clearFallback"
  @update:modelValue="updateFallback"
  @visible-change="onVisibleChange"
/>`;

const controlScript = `const fallbackTime = useRef("12:30");
const visibleLog = useRef("等待聚焦");

const clearFallback = () => "09:00";

const updateFallback = (event) => {
  fallbackTime.set(event.detail || "");
};

const onVisibleChange = (event) => {
  visibleLog.set(event.detail ? "面板已打开" : "面板已关闭");
};`;

const PageTimePickerEx3 = defineHtml(html`
<elf-playground
      title="限制范围、不可编辑与清空回退值"
      :code=${controlCode}
      :script=${controlScript}
    >
      <div style="display:grid;gap:12px;width:100%;max-width:820px">
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <elf-time-picker
            :modelValue.prop="fallbackTime"
            min="09:00"
            max="18:00"
            size="lg"
            :editable=${false}
            :valueOnClear.prop=${clearFallback}
            @update:modelValue=${updateFallback}
            @visible-change=${onVisibleChange}
          ></elf-time-picker>
          <span slot="status" class="demo-state">{{ fallbackTime }} / {{ visibleLog }}</span>
        </div>
      </div>
    </elf-playground>
`);

export { PageTimePickerEx3 };
