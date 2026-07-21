import { defineHtml, html, useRef } from "@elfui/core";

const limitedTags = useRef(["Alpha", "Design system", "Responsive layout"]);

const code2 = `<elf-input-tag
  :modelValue.prop=\${limitedTags}
  variant="outlined"
  :max=\${6}
  size="lg"
  tag-type="success"
  tag-effect="plain"
  placeholder="最多 6 个"
  @update:modelValue=\${onLimitedUpdate}
/>
<elf-input-tag :modelValue.prop=\${["只读"]} variant="outlined" readonly />
<elf-input-tag :modelValue.prop=\${["禁用"]} variant="outlined" disabled />`;

const script2 = `const limitedTags = useRef(["Alpha", "Design system", "Responsive layout"]);

const onLimitedUpdate = (event) => {
  limitedTags.set(event.detail);
};`;

const onLimitedUpdate = (event: CustomEvent): void => {
  limitedTags.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
};

const PageInputTagEx2 = defineHtml(html`
<elf-playground title="数量上限、自动换行与状态" :code=${code2} :script=${script2}>
      <div style="display:grid;gap:12px;max-width:420px">
        <elf-input-tag
          :modelValue.prop=${limitedTags}
          variant="outlined"
          :max=${6}
          size="lg"
          tag-type="success"
          tag-effect="plain"
          placeholder="最多 6 个"
          @update:modelValue=${onLimitedUpdate}
        ></elf-input-tag>
        <elf-input-tag :modelValue.prop=${["只读"]} variant="outlined" readonly></elf-input-tag>
        <elf-input-tag :modelValue.prop=${["禁用"]} variant="outlined" disabled></elf-input-tag>
      </div>
    </elf-playground>
`);

export { PageInputTagEx2 };
