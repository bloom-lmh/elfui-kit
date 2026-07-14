import { defineHtml, html, useRef } from "elfui";

const selectedRange = useRef<[string, string]>(["2026-07-08", "2026-07-12"]);

const onRangeUpdate = (event: CustomEvent): void => {
  if (Array.isArray(event.detail) && event.detail.length === 2) selectedRange.set([String(event.detail[0]), String(event.detail[1])]);
};

const rangeCode = `<elf-calendar range :modelValue.prop="selectedRange" @update:modelValue="onRangeUpdate" />`;

const rangeScript = `const selectedRange = useRef(["2026-07-08", "2026-07-12"]);`;

const PageCalendarEx3 = defineHtml(html`
<elf-playground title="范围选择" :code=${rangeCode} :script=${rangeScript}>
      <elf-calendar range :modelValue.prop=${selectedRange.value} @update:modelValue=${onRangeUpdate}></elf-calendar>
      <span slot="status" class="demo-state">范围：{{ selectedRange.value.join(" 至 ") }}</span>
    </elf-playground>
`);

export { PageCalendarEx3 };
