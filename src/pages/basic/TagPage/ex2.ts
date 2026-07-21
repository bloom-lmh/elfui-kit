import { defineHtml, html, useRef } from "@elfui/core";

const roundCode = `<elf-tag round>round</elf-tag>
<elf-tag round type="success">success</elf-tag>`;

const closableCode = `<elf-tag closable @close=\${onClose}>tag1</elf-tag>
<elf-tag closable type="success" @close=\${onClose}>tag2</elf-tag>
<elf-tag closable type="danger" @close=\${onClose}>tag3</elf-tag>`;

const checkedCode = `<elf-tag checked hit type="primary">checked</elf-tag>
<elf-tag checked="false" hit type="info" @update:checked=\${onCheckedUpdate}>可选择</elf-tag>
<elf-tag effect="dark" type="success">dark</elf-tag>
<elf-tag effect="plain" type="warning">plain</elf-tag>
<elf-tag checked="false" disabled>禁用选择</elf-tag>
<elf-tag disable-transitions type="danger">无过渡</elf-tag>`;

const closeScript = `const closeState = useRef("等待关闭操作");

const onClose = (event) => {
  closeState.set(\`已触发 close：\${event.currentTarget.textContent.trim()}\`);
};`;

const checkedScript = `const checkedState = useRef("当前：未选中");

const onCheckedUpdate = (event) => {
  checkedState.set(event.detail ? "当前：已选中" : "当前：未选中");
};`;

const closeState = useRef("等待关闭操作");
const checkedState = useRef("当前：未选中");

const onClose = (event: CustomEvent): void => {
  closeState.set(`已触发 close：${(event.currentTarget as HTMLElement).textContent?.trim() || ""}`);
};

const onCheckedUpdate = (event: CustomEvent<boolean>): void => {
  checkedState.set(event.detail ? "当前：已选中" : "当前：未选中");
};

const staticScript = `// round 是纯展示属性。`;

const PageTagEx2 = defineHtml(html`
  <h2>圆角</h2>
  <elf-playground title="round" :code=${roundCode} :script=${staticScript}>
    <elf-tag round>round</elf-tag>
    <elf-tag round type="success">success</elf-tag>
    <elf-tag round variant="outlined" type="warning">warning</elf-tag>
  </elf-playground>
  <h2>可关闭</h2>
  <elf-playground title="closable" :code=${closableCode} :script=${closeScript}>
    <span slot="status" class="demo-state">{{ closeState }}</span>
    <elf-tag closable @close=${onClose}>tag1</elf-tag>
    <elf-tag closable type="success" @close=${onClose}>tag2</elf-tag>
    <elf-tag closable type="danger" @close=${onClose}>tag3</elf-tag>
  </elf-playground>
  <elf-playground title="checked / hit / effect" :code=${checkedCode} :script=${checkedScript}>
    <span slot="status" class="demo-state">{{ checkedState }}</span>
    <elf-tag checked hit type="primary">checked</elf-tag>
    <elf-tag checked="false" hit type="info" @update:checked=${onCheckedUpdate}>可选择</elf-tag>
    <elf-tag effect="dark" type="success">dark</elf-tag>
    <elf-tag effect="plain" type="warning">plain</elf-tag>
    <elf-tag checked="false" disabled>禁用选择</elf-tag>
    <elf-tag disable-transitions type="danger">无过渡</elf-tag>
  </elf-playground>
`);

export { PageTagEx2 };
