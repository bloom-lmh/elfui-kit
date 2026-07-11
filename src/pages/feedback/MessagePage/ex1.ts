import { defineHtml, html } from "elfui";
import { ElfMessage } from "../../../components/Feedback";

const showInfo = (): void => {
  ElfMessage("这是一条普通提示");
};

const showSuccess = (): void => {
  ElfMessage.success("操作成功");
};

const showWarning = (): void => {
  ElfMessage.warning("注意小心");
};

const showDanger = (): void => {
  ElfMessage.danger("发生错误");
};

const PageMessageEx1 = defineHtml(html`
  <h2>基础</h2>
  <elf-playground title="四种类型">
    <elf-button @click=${showInfo}>info</elf-button>
    <elf-button color="success" @click=${showSuccess}>success</elf-button>
    <elf-button color="warning" @click=${showWarning}>warning</elf-button>
    <elf-button color="danger" @click=${showDanger}>danger</elf-button>
  </elf-playground>
`);

export { PageMessageEx1 };
