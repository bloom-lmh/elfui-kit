import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const basicSelected = useRef("未选择");

const advancedSelected = useRef("未选择");

const triggerSelected = useRef("未选择");

const items = [
  { label: "编辑资料", command: "edit", icon: "✎", shortcut: "E" },
  { label: "复制链接", command: "copy", icon: "⧉", shortcut: "Ctrl C" },
  {
    label: "更多操作",
    command: "more",
    icon: "⋯",
    children: [
      { label: "移动到归档", command: "archive" },
      { label: "导出记录", command: "export" }
    ]
  },
  { label: "删除", command: "delete", icon: "×", divided: true }
];

const disabledItems = [
  { label: "刷新", command: "refresh" },
  { label: "锁定中", command: "lock", disabled: true },
  { label: "审计日志", command: "audit" }
];

const basicCode = `<elf-dropdown
  :items.prop=\${items}
  label="更多操作"
  @command=\${onBasicCommand}
></elf-dropdown>`;

const advancedCode = `<elf-dropdown
  :items.prop=\${items}
  label="选择后不关闭"
  :hideOnClick=\${false}
  @command=\${onAdvancedCommand}
></elf-dropdown>`;

const triggerCode = `<elf-dropdown trigger="hover" placement="bottom-start" :items.prop=\${items}></elf-dropdown>
<elf-dropdown trigger="contextmenu" :items.prop=\${items}></elf-dropdown>`;

const compatCode = `<elf-dropdown
  type="primary"
  trigger="hover"
  :items.prop=\${items}
  :showTimeout=\${120}
  :hideTimeout=\${240}
  :triggerKeys=\${["ArrowDown"]}
  popper-class="dropdown-demo-popper"
  :popperStyle=\${{ width: "240px" }}
  :closeOnClickOutside=\${false}
></elf-dropdown>`;

const triggerScript = `const items = [
  { label: "编辑资料", command: "edit", icon: "✎", shortcut: "E" },
  { label: "复制链接", command: "copy", icon: "⧉", shortcut: "Ctrl C" },
  {
    label: "更多操作",
    command: "more",
    icon: "⋯",
    children: [
      { label: "移动到归档", command: "archive" },
      { label: "导出记录", command: "export" }
    ]
  }
];`;

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

const commandText = (event: CustomEvent): string => {
  const detail = event.detail as { command?: string; item?: { label?: string } };
  return `${String(detail.command || "")} / ${String(detail.item?.label || "")}`;
};

const onBasicCommand = (event: CustomEvent): void => {
  basicSelected.set(commandText(event));
};

const onAdvancedCommand = (event: CustomEvent): void => {
  advancedSelected.set(commandText(event));
};

const onTriggerCommand = (event: CustomEvent): void => {
  triggerSelected.set(commandText(event));
};

const PageDropdown = defineHtml(html`
  <elf-container>
    <h1>Dropdown 下拉菜单</h1>
    <p>用于承载一组轻量命令，支持点击、悬停、右键、分裂按钮、禁用项、分割线和子菜单。</p>

    <elf-playground title="基础命令菜单" :code=${basicCode} :script=${triggerScript}>
      <div style="display:grid;gap:12px;align-items:start">
        <elf-dropdown
          :items.prop=${items}
          label="更多操作"
          @command=${onBasicCommand}
        ></elf-dropdown>
        <span class="demo-state">当前命令：{{ basicSelected }}</span>
      </div>
    </elf-playground>

    <elf-playground title="子菜单、禁用项与保持展开" :code=${advancedCode} :script=${triggerScript}>
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <elf-dropdown
          :items.prop=${items}
          label="选择后不关闭"
          :hideOnClick=${false}
          @command=${onAdvancedCommand}
        ></elf-dropdown>
        <elf-dropdown :items.prop=${disabledItems} label="禁用项"></elf-dropdown>
        <span class="demo-state">当前命令：{{ advancedSelected }}</span>
      </div>
    </elf-playground>

    <elf-playground title="触发方式与位置" :code=${triggerCode} :script=${triggerScript}>
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <elf-dropdown
          trigger="hover"
          placement="bottom-start"
          :items.prop=${items}
          label="Hover 展开"
          @command=${onTriggerCommand}
        ></elf-dropdown>
        <elf-dropdown
          trigger="contextmenu"
          :items.prop=${items}
          label="右键展开"
          @command=${onTriggerCommand}
        ></elf-dropdown>
        <elf-dropdown
          split-button
          :items.prop=${disabledItems}
          label="分裂按钮"
          @command=${onTriggerCommand}
        ></elf-dropdown>
        <span class="demo-state">当前命令：{{ triggerSelected }}</span>
      </div>
    </elf-playground>

    <elf-playground title="兼容配置" :code=${compatCode} :script=${triggerScript}>
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <elf-dropdown
          type="primary"
          trigger="hover"
          :items.prop=${items}
          :showTimeout=${120}
          :hideTimeout=${240}
          :triggerKeys=${["ArrowDown"]}
          popper-class="dropdown-demo-popper"
          :popperStyle=${{ width: "240px" }}
          :closeOnClickOutside=${false}
          label="Hover / ArrowDown"
        ></elf-dropdown>
      </div>
    </elf-playground>

    <h2>API</h2>
    <elf-props-table title="Dropdown Props" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="Dropdown Events" :rows=${eventsRows}></elf-props-table>
    <elf-props-table title="Dropdown Expose" :rows=${exposeRows}></elf-props-table>
  </elf-container>
`);

export { PageDropdown };
