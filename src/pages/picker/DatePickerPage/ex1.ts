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

    <h2>外观变体</h2>
    <elf-playground title="六种日期输入表面">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;width:100%">
        <elf-date-picker variant="default" label="Default" model-value="2026-07-17"></elf-date-picker>
        <elf-date-picker variant="outlined" label="Outlined" model-value="2026-07-17"></elf-date-picker>
        <elf-date-picker variant="underlined" label="Underlined" model-value="2026-07-17"></elf-date-picker>
        <elf-date-picker variant="solo" label="Solo" model-value="2026-07-17"></elf-date-picker>
        <elf-date-picker variant="solo-filled" label="Solo filled" model-value="2026-07-17"></elf-date-picker>
        <elf-date-picker variant="solo-inverted" label="Solo inverted" model-value="2026-07-17"></elf-date-picker>
      </div>
    </elf-playground>
`);

export { PageDatePickerEx1 };
