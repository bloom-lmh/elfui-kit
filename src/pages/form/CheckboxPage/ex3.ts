import { defineHtml, html, useRef } from "@elfui/core";

const fruits = useRef<string[]>(["apple"]);

const onUpdate = (event: CustomEvent): void => fruits.set([...(event.detail as string[])]);

const code = `<elf-checkbox-group
  :modelValue.prop=\${fruits.value}
  min="1"
  max="2"
  @update:modelValue=\${onUpdate}
>
  <elf-checkbox value="apple" label="苹果" />
  <elf-checkbox value="banana" label="香蕉" />
  <elf-checkbox value="orange" label="橙子" />
</elf-checkbox-group>`;

const script = `const fruits = useRef(["apple"]);
const onUpdate = (event) => fruits.set([...event.detail]);`;

const PageCheckboxEx3 = defineHtml(html`
  <elf-playground title="min=1 max=2" :code=${code} :script=${script}>
    <elf-checkbox-group
      :modelValue.prop=${fruits.value}
      min="1"
      max="2"
      @update:modelValue=${onUpdate}
    >
      <elf-checkbox value="apple" label="苹果"></elf-checkbox>
      <elf-checkbox value="banana" label="香蕉"></elf-checkbox>
      <elf-checkbox value="orange" label="橙子"></elf-checkbox>
    </elf-checkbox-group>
    <span slot="status" class="demo-state">选中：{{ fruits.join(', ') }}</span>
  </elf-playground>
`);

export { PageCheckboxEx3 };
