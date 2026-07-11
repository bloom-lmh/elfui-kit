import { defineHtml, html, useRef } from "elfui";

const code1 = `<elf-pop-confirm placement="right" title="确认退出？">
  <elf-button>右侧弹出</elf-button>
</elf-pop-confirm>`;

const code2 = `<elf-pop-confirm
  trigger="manual"
  :visible="visible"
  title="提交审批？"
  content="提交后将进入审批流程"
  @update:visible="visible = $event.detail"
  @confirm="submit"
>
  <elf-button color="primary">手动控制</elf-button>
</elf-pop-confirm>`;

const visible = useRef(false);
const status = useRef("等待提交");

const toggleVisible = (): void => {
  visible.set(!visible.value);
};

const onVisibleChange = (event: Event): void => {
  visible.set(Boolean((event as CustomEvent<boolean>).detail));
};

const submit = (): void => {
  status.set("提交中...");
  setTimeout(() => {
    visible.set(false);
    status.set("已提交审批");
  }, 800);
};

const PagePopConfirmEx2 = defineHtml(html`
  <h2>定位与受控</h2>
  <elf-playground title="四个方向" :code=${code1}>
    <div style="display:flex;gap:12px;flex-wrap:wrap;padding:24px 0">
      <elf-pop-confirm title="上方弹出" content="默认方向" placement="top">
        <elf-button>上方</elf-button>
      </elf-pop-confirm>
      <elf-pop-confirm title="下方弹出" content="适合顶部工具栏" placement="bottom">
        <elf-button>下方</elf-button>
      </elf-pop-confirm>
      <elf-pop-confirm title="左侧弹出" content="适合右侧操作列" placement="left">
        <elf-button>左侧</elf-button>
      </elf-pop-confirm>
      <elf-pop-confirm title="右侧弹出" content="适合左侧导航" placement="right">
        <elf-button>右侧</elf-button>
      </elf-pop-confirm>
    </div>
  </elf-playground>

  <elf-playground title="受控模式与异步动作" :code=${code2}>
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
      <elf-pop-confirm
        trigger="manual"
        :visible=${visible}
        title="提交审批？"
        content="提交后将进入审批流程"
        confirm-text="提交"
        cancel-text="再看看"
        @update:visible=${onVisibleChange}
        @confirm=${submit}
      >
        <elf-button color="primary">手动控制</elf-button>
      </elf-pop-confirm>
      <elf-button variant="outlined" @click=${toggleVisible}>切换气泡</elf-button>
      <span style="font-size:13px;color:var(--elf-text-secondary)">{{ status }}</span>
    </div>
  </elf-playground>
`);

export { PagePopConfirmEx2 };
