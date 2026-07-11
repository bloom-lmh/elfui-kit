import { defineHtml, html, useRef } from "elfui";

const code1 = `<elf-pop-confirm
  title="确认删除？"
  content="删除后不可恢复"
  @confirm="remove"
  @cancel="cancel"
>
  <elf-button color="danger">删除</elf-button>
</elf-pop-confirm>`;

const code2 = `<elf-pop-confirm title="确认保存？" trigger="hover">
  <elf-button variant="outlined">悬浮触发</elf-button>
</elf-pop-confirm>`;

const lastAction = useRef("尚未操作");

const onConfirm = (): void => {
  lastAction.set("已确认删除");
};

const onCancel = (): void => {
  lastAction.set("已取消");
};

const PagePopConfirmEx1 = defineHtml(html`
  <h2>基础用法</h2>
  <elf-playground title="点击确认" :code=${code1}>
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
      <elf-pop-confirm
        title="确认删除？"
        content="删除后不可恢复"
        @confirm=${onConfirm}
        @cancel=${onCancel}
      >
        <elf-button color="danger">删除</elf-button>
      </elf-pop-confirm>
      <span style="font-size:13px;color:var(--elf-text-secondary)">上次操作：{{ lastAction }}</span>
    </div>
  </elf-playground>

  <elf-playground title="悬浮触发" :code=${code2}>
    <elf-pop-confirm title="确认保存？" content="保存当前草稿" trigger="hover">
      <elf-button variant="outlined">悬浮触发</elf-button>
    </elf-pop-confirm>
  </elf-playground>
`);

export { PagePopConfirmEx1 };
