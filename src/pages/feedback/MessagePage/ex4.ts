import { defineHtml, html } from "elfui";
import { useRef } from "elfui";
import { ElfMessage } from "../../../components/Feedback";

const lastEvent = useRef("等待交互");

const showBottom = (): void => {
  ElfMessage.success("保存完成，底部提示已出现", {
    position: "bottom",
    offset: 32,
    zIndex: 3100,
    closable: true,
    duration: 0,
    onClick: () => lastEvent.set("点击了底部 Message"),
    onClose: () => lastEvent.set("底部 Message 已关闭")
  });
};

const code4 = `ElfMessage.success("保存完成，底部提示已出现", {
  position: "bottom",
  offset: 32,
  zIndex: 3100,
  closable: true,
  duration: 0,
  onClick: () => {},
  onClose: () => {}
})`;

const PageMessageEx4 = defineHtml(html`
  <h2>位置与回调</h2>
  <elf-playground title="position / offset / zIndex / callbacks" :code="code4">
    <div style="display:grid;gap:12px">
      <elf-button color="success" @click="showBottom">底部提示</elf-button>
      <p class="demo-state">{{ lastEvent }}</p>
    </div>
  </elf-playground>
`);

export { PageMessageEx4 };
