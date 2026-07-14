import { defineHtml, html, useRef } from "elfui";

const dates = useRef<string[]>(["2026-06-10", "2026-06-14"]);

const readDetail = <T>(event: Event, fallback: T): T =>
  ((event as CustomEvent).detail ?? fallback) as T;

const updateDates = (event: Event): void => {
  const detail = readDetail<unknown>(event, []);
  dates.set(Array.isArray(detail) ? detail.map(String) : []);
};

const multipleCode = `<elf-date-picker
  multiple
  clearable
  :modelValue.prop="dates"
/>`;

const selectedDates = (): string => dates.value.join("，") || "暂无";

const PageDatePickerEx4 = defineHtml(html`
<elf-playground title="多日期" :code="multipleCode">
      <div style="display:grid;gap:12px;max-width:620px">
        <elf-date-picker
          multiple
          clearable
          :modelValue.prop="dates"
          @update:modelValue="updateDates"
        ></elf-date-picker>
        <span slot="status" class="demo-state">已选：{{ selectedDates() }}</span>
      </div>
    </elf-playground>
`);

export { PageDatePickerEx4 };
