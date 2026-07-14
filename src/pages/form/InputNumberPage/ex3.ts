import { defineHtml, html } from "elfui";

const code3 = `<label>禁用状态 <elf-input-number disabled :modelValue.prop=\${3} /></label>
<label>只读状态 <elf-input-number readonly :modelValue.prop=\${6} /></label>
<label>隐藏控制按钮 <elf-input-number :controls.prop=\${false} :modelValue.prop=\${8} /></label>`;

const PageInputNumberEx3 = defineHtml(html`
<elf-playground title="禁用、只读与隐藏控制按钮" :code=${code3}>
      <div style="display:grid;gap:12px">
        <label style="display:flex;align-items:center;gap:12px">禁用状态 <elf-input-number disabled :modelValue.prop=${3}></elf-input-number></label>
        <label style="display:flex;align-items:center;gap:12px">只读状态 <elf-input-number readonly :modelValue.prop=${6}></elf-input-number></label>
        <label style="display:flex;align-items:center;gap:12px">隐藏控制按钮 <elf-input-number :controls.prop=${false} :modelValue.prop=${8}></elf-input-number></label>
      </div>
    </elf-playground>
`);

export { PageInputNumberEx3 };
