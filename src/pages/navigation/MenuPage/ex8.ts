import { defineHtml, html, useRef } from "elfui";

const active = useRef("workspace/projects");
const lastAction = useRef("等待操作");

const onSelect = (event: CustomEvent): void => {
  active.set(String(event.detail));
  lastAction.set(`已选择 ${String(event.detail)}`);
};

const onItemClick = (event: CustomEvent): void => {
  lastAction.set(`MenuItem click：${event.detail.index}`);
};

const code = `<elf-menu
  :modelValue=\${active}
  :defaultOpeneds=\${["workspace"]}
  @update:modelValue="onSelect"
>
  <elf-sub-menu
    index="workspace"
    title="工作台"
    icon="W"
    expand-close-icon="＋"
    expand-open-icon="−"
  >
    <elf-menu-item-group title="交付管理">
      <elf-menu-item index="workspace/projects" title="项目" @click="onItemClick" />
      <elf-menu-item index="workspace/releases" title="发布" />
    </elf-menu-item-group>
    <elf-menu-item index="workspace/archive" title="归档" disabled />
  </elf-sub-menu>
  <elf-menu-item index="settings" title="设置" icon="S" />
</elf-menu>`;

const PageMenuEx8 = defineHtml(html`
  <h2>组合式菜单</h2>
  <elf-playground title="SubMenu / MenuItem / MenuItemGroup" :code=${code}>
    <span slot="status">{{ lastAction }} · 当前：{{ active }}</span>
    <elf-menu
      bordered
      rounded
      :modelValue=${active}
      :defaultOpeneds=${["workspace"]}
      @update:modelValue=${onSelect}
      style="height:360px"
    >
      <elf-sub-menu
        index="workspace"
        title="工作台"
        icon="W"
        expand-close-icon="＋"
        expand-open-icon="−"
      >
        <elf-menu-item-group title="交付管理">
          <elf-menu-item
            index="workspace/projects"
            title="项目"
            :route=${{ path: "/projects" }}
            @click=${onItemClick}
          ></elf-menu-item>
          <elf-menu-item index="workspace/releases" title="发布"></elf-menu-item>
        </elf-menu-item-group>
        <elf-menu-item index="workspace/archive" title="归档" disabled></elf-menu-item>
      </elf-sub-menu>
      <elf-menu-item index="settings" title="设置" icon="S"></elf-menu-item>
    </elf-menu>
  </elf-playground>
`);

export { PageMenuEx8 };
