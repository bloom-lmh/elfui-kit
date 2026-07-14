import { defineHtml, html, useComponents } from "elfui";

import { PageDropdownEx1 } from "./ex1";
import { PageDropdownEx2 } from "./ex2";
import { PageDropdownEx3 } from "./ex3";
import { PageDropdownEx4 } from "./ex4";

const propsRows = [
  { name: "items", type: "DropdownItem[]", default: "[]", desc: "菜单项，支持 children 嵌套" },
  { name: "trigger", type: "click | hover | contextmenu", default: "click", desc: "触发方式" },
  {
    name: "placement",
    type: "bottom-start | bottom-end | top-start | top-end",
    default: "bottom-start",
    desc: "弹层位置"
  },
  { name: "splitButton", type: "boolean", default: "false", desc: "分裂按钮模式" },
  { name: "hideOnClick", type: "boolean", default: "true", desc: "点击菜单后自动关闭" },
  { name: "type", type: "default | primary | success | warning | danger | info", default: "default", desc: "按钮类型" },
  { name: "showTimeout / hideTimeout", type: "number", default: "120 / 180", desc: "hover 展开和关闭延迟" },
  { name: "triggerKeys", type: "string[]", default: "Enter / Space / ArrowDown", desc: "键盘触发键" },
  { name: "popperClass / popperStyle", type: "string / object", default: "-", desc: "弹层自定义样式" },
  { name: "closeOnClickOutside", type: "boolean", default: "true", desc: "点击外部是否关闭" }
];

const eventsRows = [
  { name: "command", type: "({ command, item }) => void", desc: "点击可选菜单项时触发" },
  { name: "visible-change", type: "(visible) => void", desc: "展开状态变化时触发" },
  { name: "click", type: "(event) => void", desc: "分裂按钮主按钮点击时触发" }
];

const exposeRows = [
  { name: "handleOpen / show", type: "() => void", desc: "打开下拉菜单" },
  { name: "handleClose / hide", type: "() => void", desc: "关闭下拉菜单" },
  { name: "toggle", type: "() => void", desc: "切换展开状态" }
];

useComponents({
  "page-dropdown-ex1": PageDropdownEx1,
  "page-dropdown-ex2": PageDropdownEx2,
  "page-dropdown-ex3": PageDropdownEx3,
  "page-dropdown-ex4": PageDropdownEx4
});

const PageDropdown = defineHtml(html`
  <elf-container>
    <h1>Dropdown 下拉菜单</h1>
    <p>用于承载一组轻量命令，支持点击、悬停、右键、分裂按钮、禁用项、分割线和子菜单。</p>

    <page-dropdown-ex1 />

    <page-dropdown-ex2 />

    <page-dropdown-ex3 />

    <page-dropdown-ex4 />

    <h2>API</h2>
    <elf-props-table title="Dropdown Props" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="Dropdown Events" :rows=${eventsRows}></elf-props-table>
    <elf-props-table title="Dropdown Expose" :rows=${exposeRows}></elf-props-table>
  </elf-container>
`);

export { PageDropdown };
