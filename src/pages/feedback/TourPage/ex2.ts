import { defineHtml, html, useRef } from "elfui";

const code = `<elf-tour keyboard :steps="steps" :visible="visible" />`;

const tourSteps = [
  {
    target: "#tour-kb-a",
    title: "方向键前进",
    content: "按右方向键或下方向键进入下一步。",
    placement: "right" as const
  },
  {
    target: "#tour-kb-b",
    title: "方向键后退",
    content: "按左方向键或上方向键回到上一步，按 ESC 关闭。",
    placement: "bottom" as const
  },
  {
    target: "#tour-kb-c",
    title: "完成",
    content: "最后一步点击完成会触发 finish 事件。",
    placement: "left" as const
  }
];

const visible = useRef(false);
const current = useRef(0);
const status = useRef("未开始");

const startTour = (): void => {
  current.set(0);
  status.set("引导中");
  visible.set(true);
};

const closeTour = (): void => {
  visible.set(false);
  status.set("已关闭");
};

const finishTour = (): void => {
  visible.set(false);
  status.set("已完成");
};

const onCurrentChange = (event: Event): void => {
  current.set(Number((event as CustomEvent<number>).detail ?? 0));
};

const PageTourEx2 = defineHtml(html`
  <h2>键盘与焦点</h2>
  <elf-playground title="键盘控制" :code=${code}>
    <div
      style="display:flex;gap:16px;flex-wrap:wrap;padding:20px;border:1px solid var(--elf-border);border-radius:8px"
    >
      <button
        id="tour-kb-a"
        style="padding:18px 22px;border:0;border-radius:8px;background:var(--elf-primary);color:#fff"
      >
        第一步
      </button>
      <button
        id="tour-kb-b"
        style="padding:18px 22px;border:0;border-radius:8px;background:var(--elf-success);color:#fff"
      >
        第二步
      </button>
      <button
        id="tour-kb-c"
        style="padding:18px 22px;border:0;border-radius:8px;background:var(--elf-warning);color:#202124"
      >
        第三步
      </button>
    </div>
    <div style="display:flex;gap:12px;align-items:center;margin-top:16px;flex-wrap:wrap">
      <elf-button color="primary" @click=${startTour}>开始键盘引导</elf-button>
      <span style="font-size:13px;color:var(--elf-text-secondary)">状态：{{ status }}</span>
    </div>
    <elf-tour
      :steps=${tourSteps}
      :visible=${visible}
      :current=${current}
      @update:current=${onCurrentChange}
      @close=${closeTour}
      @finish=${finishTour}
    ></elf-tour>
  </elf-playground>
`);

export { PageTourEx2 };
