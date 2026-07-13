import { defineHtml, html, useComponents, useRef } from "elfui";
import { PageInputTagProps } from "./props";

useComponents({ "page-input-tag-props": PageInputTagProps });

const tags = useRef(["设计", "开发"]);
const limitedTags = useRef(["Alpha"]);

const code1 = `<elf-input-tag
  :modelValue.prop=\${tags}
  clearable
  placeholder="输入后按 Enter"
  @update:modelValue=\${onTagsUpdate}
  @add-tag=\${onAddTag}
  @remove-tag=\${onRemoveTag}
/>
<span class="demo-state">当前：\${tags.join(" / ")}</span>`;

const script1 = `const tags = useRef(["设计", "开发"]);

const onTagsUpdate = (event) => {
  tags.set(event.detail);
};

const onAddTag = (event) => {
  console.log("add", event.detail);
};

const onRemoveTag = (event) => {
  console.log("remove", event.detail);
};`;

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

const onTagsUpdate = (event: CustomEvent): void => {
  tags.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
};

const onLimitedUpdate = (event: CustomEvent): void => {
  limitedTags.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
};

const onAddTag = (): void => undefined;
const onRemoveTag = (): void => undefined;

const PageInputTag = defineHtml(html`
  <elf-container>
    <h1>InputTag 标签输入</h1>
    <p>把输入内容转换成标签。输入框宽度保持稳定；标签较多时可水平滚动，折叠后悬停数量按钮可查看并删除隐藏标签。</p>

    <elf-playground title="受控数组与清空" :code=${code1} :script=${script1}>
      <elf-input-tag
        :modelValue.prop=${tags}
        clearable
        placeholder="输入后按 Enter"
        @update:modelValue=${onTagsUpdate}
        @add-tag=${onAddTag}
        @remove-tag=${onRemoveTag}
      ></elf-input-tag>
      <span class="demo-state">当前：${tags.value.join(" / ")}</span>
    </elf-playground>

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
    <page-input-tag-props></page-input-tag-props>
  </elf-container>
`);

export { PageInputTag };
