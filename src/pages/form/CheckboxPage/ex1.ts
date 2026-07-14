import { defineHtml, html, useReactive } from "elfui";


const data = useReactive({ agree: false });

const code1 = `<elf-checkbox v-model="agree" label="同意条款" />
<span>{{ agree ? '✓ 已勾选' : '未勾选' }}</span>`;

const PageCheckboxEx1 = defineHtml(html`
  <elf-playground title="单个 Checkbox" :code="code1">
    <elf-checkbox v-model="data.agree" label="同意条款" />
    <span style="font-size:12px;color:var(--elf-text-secondary)"
      >{{ data.agree ? '✓ 已勾选' : '未勾选' }}</span
    >
  </elf-playground>
`);

export { PageCheckboxEx1 };
