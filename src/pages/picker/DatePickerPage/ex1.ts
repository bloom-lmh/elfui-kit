import { defineHtml, html, useRef } from "elfui";

const date = useRef("2026-06-17");

const readDetail = <T>(event: Event, fallback: T): T =>
  ((event as CustomEvent).detail ?? fallback) as T;

const updateDate = (event: Event): void => {
  date.set(String(readDetail(event, "")));
};

const basicCode = `<elf-date-picker
  :modelValue.prop="date"
  clearable
/>`;

const PageDatePickerEx1 = defineHtml(html`
<h2>基础</h2>
<elf-playground title="基础日期" :code="basicCode">
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <elf-date-picker
          :modelValue.prop="date"
          label="发布日期"
          clearable
          @update:modelValue="updateDate"
        ></elf-date-picker>
        <span slot="status" class="demo-state">{{ date }}</span>
      </div>
    </elf-playground>
`);

export { PageDatePickerEx1 };
