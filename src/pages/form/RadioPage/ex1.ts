import { defineHtml, html, useReactive } from "elfui";


const data = useReactive({ picked: "a" });

const code1 = `<elf-radio-group v-model="data.picked" name="radio-demo" aria-label="Choose an option">
  <elf-radio value="a" label="A 选项" />
  <elf-radio value="b" label="B 选项" />
  <elf-radio value="c" label="C 选项" />
</elf-radio-group>
<span style="font-size:12px;color:var(--elf-text-secondary)">当前: {{ data.picked }}</span>`;

const PageRadioEx1 = defineHtml(html`
  <elf-playground title="RadioGroup 组合" :code="code1">
    <elf-radio-group v-model="data.picked" name="radio-demo" aria-label="Choose an option">
      <elf-radio value="a" label="A 选项" />
      <elf-radio value="b" label="B 选项" />
      <elf-radio value="c" label="C 选项" />
    </elf-radio-group>
    <span style="font-size:12px;color:var(--elf-text-secondary)">当前: {{ data.picked }}</span>
  </elf-playground>
`);

export { PageRadioEx1 };
