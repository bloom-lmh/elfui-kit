import { defineHtml, html, useRef } from "elfui";

const text = useRef("");
const password = useRef("");

const code1 = `<div style="width:280px">
  <elf-input
    :modelValue=\${text}
    placeholder="请输入"
    @update:modelValue=\${onTextUpdate}
  />
</div>
<span class="demo-state">当前：{{ text || '未输入' }}</span>`;

const script1 = `const text = useRef("");

const onTextUpdate = (event) => {
  text.set(event.detail);
};`;

const code2 = `<div style="width:240px;margin-bottom:8px">
  <elf-input
    type="password"
    show-password
    :modelValue=\${password}
    placeholder="密码"
    @update:modelValue=\${onPasswordUpdate}
  />
</div>
<div style="width:240px;margin-bottom:8px">
  <elf-input type="email" placeholder="邮箱" autocomplete="email" />
</div>
<div style="width:240px;margin-bottom:8px">
  <elf-input type="number" placeholder="数字" min="1" max="99" step="1" />
</div>
<div style="width:240px">
  <elf-input type="search" placeholder="搜索" />
</div>`;

const script2 = `const password = useRef("");

const onPasswordUpdate = (event) => {
  password.set(event.detail);
};`;

const onTextUpdate = (event: CustomEvent): void => {
  text.set(String(event.detail || ""));
};

const onPasswordUpdate = (event: CustomEvent): void => {
  password.set(String(event.detail || ""));
};

const PageInputEx1 = defineHtml(html`
  <h2>基础</h2>
  <elf-playground title="text + v-model" :code=${code1} :script=${script1}>
    <div style="width:280px">
      <elf-input
        :modelValue=${text}
        placeholder="请输入"
        @update:modelValue=${onTextUpdate}
      ></elf-input>
    </div>
    <span class="demo-state">当前：{{ text || '未输入' }}</span>
  </elf-playground>

  <h2>不同类型</h2>
  <elf-playground title="password / email / number / search" :code=${code2} :script=${script2}>
    <div style="width:240px;margin-bottom:8px">
      <elf-input
        type="password"
        show-password
        :modelValue=${password}
        placeholder="密码"
        @update:modelValue=${onPasswordUpdate}
      ></elf-input>
    </div>
    <div style="width:240px;margin-bottom:8px">
      <elf-input type="email" placeholder="邮箱" autocomplete="email"></elf-input>
    </div>
    <div style="width:240px;margin-bottom:8px">
      <elf-input type="number" placeholder="数字" min="1" max="99" step="1"></elf-input>
    </div>
    <div style="width:240px"><elf-input type="search" placeholder="搜索"></elf-input></div>
  </elf-playground>
`);

export { PageInputEx1 };
