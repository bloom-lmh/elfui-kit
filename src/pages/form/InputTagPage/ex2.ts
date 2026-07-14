import { defineHtml, html, useRef } from "elfui";

const tags = useRef(["设计", "开发"]);

const limitedTags = useRef(["Alpha"]);

const code2 = `<elf-input-tag
  :modelValue.prop=\${limitedTags}
  :max=\${3}
  size="lg"
  placeholder="最多 3 个"
  @update:modelValue=\${onLimitedUpdate}
/>
<elf-input-tag :modelValue.prop=\${["只读"]} readonly />
<elf-input-tag :modelValue.prop=\${["禁用"]} disabled />`;

const script2 = `const limitedTags = useRef(["Alpha"]);

const onLimitedUpdate = (event) => {
  limitedTags.set(event.detail);
};`;

const onLimitedUpdate = (event: CustomEvent): void => {
  limitedTags.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
};

const PageInputTagEx2 = defineHtml(html`
<elf-playground title="数量上限、折叠标签与状态" :code=${code2} :script=${script2}>
      <div style="display:grid;gap:12px;max-width:420px">
        <elf-input-tag
          :modelValue.prop=${limitedTags}
          :max=${3}
          collapse-tags
          :max-collapse-tags=${1}
          size="lg"
          placeholder="最多 3 个"
          @update:modelValue=${onLimitedUpdate}
        ></elf-input-tag>
        <elf-input-tag :modelValue.prop=${["只读"]} readonly></elf-input-tag>
        <elf-input-tag :modelValue.prop=${["禁用"]} disabled></elf-input-tag>
      </div>
    </elf-playground>
`);

export { PageInputTagEx2 };
