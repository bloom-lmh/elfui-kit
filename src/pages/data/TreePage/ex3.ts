import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const checked = useRef<string[]>(["dashboard:view", "user:list"]);

const permissions = [
  {
    id: "dashboard",
    title: "工作台",
    children: [
      { id: "dashboard:view", title: "查看概览" },
      { id: "dashboard:export", title: "导出报表" }
    ]
  },
  {
    id: "system",
    title: "系统管理",
    children: [
      {
        id: "user",
        title: "用户管理",
        children: [
          { id: "user:list", title: "查看用户" },
          { id: "user:create", title: "创建用户" },
          { id: "user:delete", title: "删除用户", disabled: true }
        ]
      },
      {
        id: "role",
        title: "角色管理",
        children: [
          { id: "role:list", title: "查看角色" },
          { id: "role:assign", title: "分配权限" }
        ]
      }
    ]
  }
];

const onChecked = (event: Event): void => {
  const detail = (event as CustomEvent).detail;
  if (Array.isArray(detail)) checked.set(detail);
};

const checkedText = (): string => checked.value.join(", ") || "无";

const selectAdmin = (): void => {
  checked.set([
    "dashboard:view",
    "dashboard:export",
    "user:list",
    "user:create",
    "role:list",
    "role:assign"
  ]);
};

const clear = (): void => {
  checked.set([]);
};

const code = `<elf-tree
  :data.prop="permissions"
  node-key="id"
  :props.prop="{ label: 'title' }"
  :checkedKeys.prop="checked"
  @update:checkedKeys="onChecked"
  show-checkbox
  default-expand-all
/>`;

const PageTreeEx3 = defineHtml(html`
  <h2>权限树</h2>
  <elf-playground title="常见后台权限配置：回显、勾选、禁用危险权限" :code="code">
    <div class="demo-actions">
      <button type="button" @click="selectAdmin()">管理员模板</button>
      <button type="button" @click="clear()">清空</button>
    </div>
    <elf-tree
      :data.prop="permissions"
      node-key="id"
      :props.prop="{ label: 'title' }"
      :checkedKeys.prop="checked"
      @update:checkedKeys="onChecked"
      show-checkbox
      default-expand-all
    ></elf-tree>
    <p class="demo-state">权限 keys：{{ checkedText() }}</p>
  </elf-playground>
`);

export { PageTreeEx3 };
