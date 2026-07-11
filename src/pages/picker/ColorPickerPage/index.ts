import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const color = useRef("#6750a4");

const rgba = useRef("rgba(0, 106, 106, 0.8)");

const presets = [
  { label: "Primary", value: "#6750a4" },
  { label: "Teal", value: "#006a6a" },
  { label: "Amber", value: "#f9a825" },
  { label: "Danger", value: "#d32f2f" }
];

const updateColor = (event: CustomEvent): void => {
  color.set(String(event.detail));
};

const updateRgba = (event: CustomEvent): void => {
  rgba.set(String(event.detail));
};

const code = `<elf-color-picker v-model="color" :presets.prop="presets" clearable />
<elf-color-picker v-model="rgba" format="rgb" show-alpha />`;

const propsRows = [
  { name: "modelValue", type: "string", default: "#6750a4", desc: "当前颜色" },
  { name: "format", type: "hex | rgb", default: "hex", desc: "输出格式" },
  { name: "presets", type: "Array", default: "[]", desc: "预设色" },
  { name: "showAlpha", type: "boolean", default: "false", desc: "透明度" },
  { name: "clearable", type: "boolean", default: "false", desc: "可清空" }
];

const PageColorPicker = defineHtml(html`
  <elf-container>
    <h1>ColorPicker 颜色选择器</h1>
    <p>支持原生色板、文本输入、透明度、清空和预设色。</p>
    <elf-playground title="基础与透明度" :code="code">
      <div style="display:grid;gap:16px;width:100%;max-width:760px">
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <elf-color-picker
            :modelValue="color"
            :presets.prop="presets"
            clearable
            @update:modelValue="updateColor"
          ></elf-color-picker>
          <span class="demo-state">{{ color }}</span>
        </div>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <elf-color-picker
            :modelValue="rgba"
            format="rgb"
            show-alpha
            clearable
            @update:modelValue="updateRgba"
          ></elf-color-picker>
          <span class="demo-state">{{ rgba }}</span>
        </div>
      </div>
    </elf-playground>
    <h2>API</h2>
    <elf-props-table title="Props" :rows="propsRows"></elf-props-table>
  </elf-container>
`);

export { PageColorPicker };
